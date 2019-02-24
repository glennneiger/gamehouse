import React, {Component} from 'react';
import Video from '../../VideoBackground';
import WriterCard from './WriterCard';

class Write extends Component {

  renderWriterCards = ()=> {
    let cards = this.props.writers.map((writer, i) => (
      <WriterCard key={i} name={writer.name} img={writer.img} text={"This is a bunch of text that I'm putting here to test this out"}/>
    ));
    return cards;
  }

  render() {
    return (
      <div className="StoryTime">
        <Video video="storytime/write" />

        <div className="row">
          <div className="story-text">
            {this.props.story}<br/>{this.props.prompt}...
          </div>
        </div>

        <div className="row writer-cards">
          {this.renderWriterCards()}
        </div>
      </div>
    )
  }
}

export default Write;