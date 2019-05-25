import React from 'react'
import AvatarEditor from 'react-avatar-editor'
 
class MyEditor extends React.Component {



  onClickSave = () => {
    const img = this.editor ? this.editor.getImageScaledToCanvas().toDataURL() : null;
    this.props.returnImage(img);
  }
   
  setEditorRef = (editor) => this.editor = editor


  render() {
    return (
      <div className="ImgCrop cover-screen">
        <div className="column">
          <div>Upload:</div>
          <AvatarEditor
            ref={this.setEditorRef}
            image={this.props.img}
            width={280}
            height={252}
            border={10}
            color={[0, 0, 0, 0.6]} // RGBA
            scale={1}
            rotate={0}
          />
          <div className="btn" onClick={this.onClickSave}>Send</div>
          <div className="btn-link" onClick={()=>this.props.returnImage(null)}>Cancel</div>
        </div>
      </div>
    )
  }
}
 
export default MyEditor