import React, {Component} from 'react';

export default class ImgSelection extends Component {

  constructor(props) {
    super(props);
    this.state={
      imgIndices: []
    }
  }

  componentDidMount() {
    let indices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    let imgIndices = [];
    for (let i = 0; i < 9; i++) {
      let rndX = Math.floor(Math.random() * indices.length);
      imgIndices.push(indices[rndX]);
      indices.splice(rndX,1);
    }
    this.setState({imgIndices});
  }

  renderPictures = () => {
    const altTexts = ['Cat','Dog','Parrot','Dolphin','Snake','Eagle','Horse','Penguin','Owl','Goat','Pug','Frog','Elephant','Dinosaur','Jaguar','Fox'];
    let imgs = [];
    const imgIndices = this.state.imgIndices.slice();
    for (let i = 0; i < 9; i++) {
      let altText = altTexts[imgIndices[i]];
      imgs.push(
        <img alt={altText} key={i} data-imgid={imgIndices[i]} id={'img-' + i} src={`./assets/img/profiles/${('0' + imgIndices[i]).slice(-2)}.jpg`} className={!i ? 'selected' : ''} onClick={()=>this.selectImg(i)}></img>
      )
    }
    return imgs;
  }

  selectImg = (index) => {
    document.querySelector('img.selected').classList.remove('selected');
    document.querySelector(`img#img-${index}`).classList.add('selected');
  }
  
  render() {
    return (
      <div className="ImgSelection pictures">
        {this.renderPictures()}
      </div>
    )
  }
};