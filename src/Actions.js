import alt from './altConfig';


class Actions {

  selectRange(range){
    return range;
  }

  clearSelectedRange(){
    return [];
  }

}

export default alt.createActions(Actions);