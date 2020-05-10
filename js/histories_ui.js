var descriptions = {
  /** Assumes paths are ./base/pictures[0].jpg */
  createHTML: function(base,pictures){
    var pic = pictures; //test for undefined
    var html = `
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <img src="data/histories/pictures/${base}/${pic}.jpg">
            </div>
            <p>Modal body text goes here.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">Save changes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    `
    return html;
  },
  modal: function(base, pictures){
    var html = this.createHTML(base, pictures);
    $(html).modal();
  },
  testModal1: function(){
    var testmodal = this.createHTML('AVJ3',['pic1','pic2']);
    $(testmodal).modal();
  },
  testModal2: function(){
    this.modal('AVJ3',['pic1','pic2']);
  }
}

export {descriptions};
