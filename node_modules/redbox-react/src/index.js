import React, {Component, PropTypes} from 'react'
import style from './style.js'
import ErrorStackParser from 'error-stack-parser'
import assign from 'object-assign'
import {isFilenameAbsolute, makeUrl, makeLinkText} from './lib'

export default class RedBox extends Component {
  static propTypes = {
    error: PropTypes.instanceOf(Error).isRequired,
    filename: PropTypes.string,
    editorScheme: PropTypes.string,
    useLines: PropTypes.bool,
    useColumns: PropTypes.bool,
    style: PropTypes.object,
  }
  static displayName = 'RedBox'
  static defaultProps = {
    useLines: true,
    useColumns: true
  }
  render () {
    const {error, filename, editorScheme, useLines, useColumns} = this.props
    const {redbox, message, stack, frame, file, linkToFile} = assign({}, style, this.props.style)

    const frames = ErrorStackParser.parse(error).map((f, index) => {
      let text
      let url

      if (index === 0 && filename && !isFilenameAbsolute(f.fileName)) {
        url = makeUrl(filename, editorScheme)
        text = makeLinkText(filename)
      } else {
        let lines = useLines ? f.lineNumber : null
        let columns = useColumns ? f.columnNumber : null
        url = makeUrl(f.fileName, editorScheme, lines, columns)
        text = makeLinkText(f.fileName, lines, columns)
      }

      return (
        <div style={frame} key={index}>
          <div>{f.functionName}</div>
          <div style={file}>
            <a href={url} style={linkToFile}>{text}</a>
          </div>
        </div>
      )
    })
    return (
      <div style={redbox}>
        <div style={message}>{error.name}: {error.message}</div>
        <div style={stack}>{frames}</div>
      </div>
    )
  }
}
