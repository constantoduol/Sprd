import alt from './altConfig';


class Actions {

  selectRange(range){
    console.log("select range");
    return range;
  }

}

export default alt.createActions(Actions);