import Alt from 'alt';

const alt = new Alt();

class Actions {

  selectRange(r){
    console.log("select range");
    return r;
  }

}

export default alt.createActions(Actions);