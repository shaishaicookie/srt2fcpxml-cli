const fs = require('fs')
const path = require('path')

function srt_time_to_frame(srt_time, fps) {
    // srt time to total ms
    var ms = parseInt(srt_time.slice(-3));
    var srt_time = srt_time.slice(0, -4).split(':').map(Number);
    var srt_time_ms = srt_time[0] * 3600 * 1000 + srt_time[1] * 60 * 1000 + srt_time[2] * 1000 + ms;
    // ms to frame
    var frame = Math.floor(srt_time_ms / (1000 / fps));
    return frame;
}


module.exports = function fcpxml(srt_path, fps, destination_path) {
  const project_name = path.parse(srt_path).name
  
  fs.readFile(srt_path, 'utf-8', (err, data) => {
    if (err) throw err
    const subtitles = data.trim().split("\n\n")

    // params for fcpxml
    const hundredfold_fps = String(fps*100)

    // extract duration from srt
    const total_srt_time = subtitles[subtitles.length -1].trim().split("\n")[1].split(" --> ")[1]
    const total_frame = srt_time_to_frame(total_srt_time, fps)
    const hundredfold_total_frame = String(100 * total_frame)

    // create tag elements for fcpxml
    const { create } = require('xmlbuilder2');

    // root tag
    const root = create({ encoding: 'UTF-8' })

    // 前面是 parent node .elem (child name)
    // fcpxml tag
    const fcpxml = root.ele('fcpxml')
    fcpxml.att('version', '1.9')

    // resources tag
    const resources = fcpxml.ele('resources')

    // format tag
    const format = resources.ele('format')
    format.att('id', 'r1')
    format.att('name', `FFVideoFormat1080p${hundredfold_fps}`)
    format.att('frameDuration', `100/${hundredfold_fps}`)
    format.att('width', '1920')
    format.att('height', '1080')
    format.att('colorSpace', '1-1-1 (Rec. 709)')

    // effect tag
    const effect = resources.ele('effect')
    effect.att('id', 'r2')
    effect.att('name', 'Basic Title')
    effect.att('uid', '.../Titles.localized/Bumper:Opener.localized/Basic Title.localized/Basic Title.moti')

    // library tag
    const library = fcpxml.ele('library')

    // event tag
    const event = library.ele('event')
    event.att('name', 'srt2subtitles-cli')

    // project tag
    const project = event.ele('project')
    project.att('name', project_name)

    // sequence tag
    const sequence = project.ele('sequence')
    sequence.att('format', 'r1')
    sequence.att('tcStart', '0s')
    sequence.att('tcFormat', 'NDF')
    sequence.att('audioLayout', 'stereo')
    sequence.att('audioRate', '48k')
    sequence.att('duration', `${total_frame}/${hundredfold_fps}s`)

    // spline tag
    const spline = sequence.ele('spine')

    // gap tag
    const gap = spline.ele('gap')
    gap.att('name', 'Gap')
    gap.att('offset', '0s')
    gap.att('duration', `${hundredfold_total_frame}/${hundredfold_fps}s`)

  
    for (let i=0; i < subtitles.length; i++) {
        const subtitle = subtitles[i].trim().split('\n')
        const [offset, end] = subtitle[1].split(' --> ')
        const offset_frame = srt_time_to_frame(offset, fps)
        const end_frame = srt_time_to_frame(end, fps)
        const duration_frame = end_frame - offset_frame
        const hundredfold_offset_frame = String(100 * offset_frame)
        const hundredfold_duration_frame = String (100 * duration_frame)
        const subtitle_content = subtitle[2]


        // title tag
        const title = gap.ele('title')
        title.att('ref', 'r2')
        title.att('lane', '1')
        title.att('offset', `${hundredfold_offset_frame}/${hundredfold_fps}s`)
        title.att('duration', `${hundredfold_duration_frame}/${hundredfold_fps}s`)
        title.att('name', `${subtitle_content} - Basic Title`)

        // param tag
        const param1 = title.ele('param')
        param1.att('name', 'Position')
        param1.att('key', '9999/999166631/999166633/1/100/101')
        param1.att('value', '0 -465')

        const param2 = title.ele('param')
        param2.att('name', 'Flatten')
        param2.att('key', '999/999166631/999166633/2/351')
        param2.att('value', '1')


        const param3 = title.ele('param')
        param3.att('name', 'Alignment')
        param3.att('key', '9999/999166631/999166633/2/354/999169573/401')
        param3.att('value', '1 (Center)')


        // text tag
        const text = title.ele('text')
        
        // text-style 1 tag
        const text_style_1 = text.ele('text-style').txt(subtitle_content)
        text_style_1.att('ref', `ts${i}`)

        // text-style-def tag
        const text_style_def = title.ele('text-style-def')
        text_style_def.att('id', `ts${i}`)

        // text style 2 tag
        const text_style_2 = text_style_def.ele('text-style')
        text_style_2.att('font', 'Helvetica')
        text_style_2.att('fontSize', '45')
        text_style_2.att('fontFace', 'Regular')
        text_style_2.att('fontColor', '1 1 1 1')
        text_style_2.att('bold', '1')
        text_style_2.att('shadowColor', '0 0 0 0.75')
        text_style_2.att('shadowOffset', '4 315')
        text_style_2.att('alignment', 'center')    
    }

    // print xml
    const xml = root.end({ prettyPrint: true })
    // console.log(xml)

    // delete destination_path with / at the end
    destination_path = destination_path.endsWith('/') ? destination_path.slice(0, -1) : destination_path


    fs.writeFile(`${destination_path}/${project_name}.fcpxml`, xml, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
  })

}



