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
      <div>
        <div>New Picture:</div>
        <AvatarEditor
          ref={this.setEditorRef}
          image={this.props.img}
          width={280}
          height={280}
          border={20}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={1}
          rotate={0}
        />
        <div className="btn" onClick={this.onClickSave}>Save</div>
        <div className="btn" onClick={()=>this.props.returnImage(null)}>Cancel</div>
      </div>
    )
  }
}
 
export default MyEditor