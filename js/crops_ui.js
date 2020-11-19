import {gettext, get_transtext} from './mf_i18n.js';

var html_template=`
          <fieldset id="fieldset_crops">
	    <label for="crops"><h5>${gettext("Select a crop")}:</h5></label>
	    <select name="crops" id="crops">
	      <option value="barley" selected>${gettext("Barley")}</option>
	      <option value="cabbage">${gettext("Cabbage")}</option>
	      <option value="hops">${gettext("Hops")}</option>
	      <option value="kale">${gettext("Kale")}</option>
	      <option value="leeks">${gettext("Leeks")}</option>
	      <option value="oats">${gettext("Oats")}</option>
	      <option value="potatoes">${gettext("Potatoes")}</option>
	      <option value="rye">${gettext("Rye")}</option>
	      <option value="wheat">${gettext("Wheat")}</option>
	      <option value="willow_commercial">${gettext("Willow commercial")}</option>
	      <option value="willow_environmental">${gettext("Willow environmental")}</option>
	    </select>
	    <hr/>
	  <!-- </fieldset> -->
          <!-- <fieldset id="fieldset_scenario"> -->
	    <p><h5>${gettext("Future greenhouse gas emissions")}:</h5></p>
	    <input type="radio" id="low" name="scenario" value="low" checked>
	    <label for="low">${gettext("Low")}</label><br>
	    <input type="radio" id="medium" name="scenario" value="medium">
	    <label for="medium">${gettext("Medium")}</label><br>
	    <input type="radio" id="high" name="scenario" value="high">
	    <label for="high">${gettext("High")}</label>
	    <hr/>
	  <!-- </fieldset> -->
	  <!-- <fieldset id="fieldset_year"> -->
	    <p><h5>${gettext("Year")}:</h5></p>
	    <input type="radio" id="current" name="year" value="current" checked>
	    <label for="current">2019</label><br>
	    <input type="radio" id="2020" name="year" value="2020">
	    <label for="2020">2010-2039</label><br>
	    <input type="radio" id="2050" name="year" value="2050">
	    <label for="2050">2040-2069</label><br>
	    <input type="radio" id="2080" name="year" value="2080">
	    <label for="2080">2070-2099</label><br>
	  </fieldset>
`;

function add_sidebar(id) {
    $('#'+id).html(html_template);
}



/* Show introductory modal dialogy in different languages */
function add_intro_modal(_id) {
    const html = `
      <!-- modal-{sm,lg,xl} -->
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${gettext("Crops")}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ${get_transtext("crops_intro_html")}
            </div>
          </div>
       </div>
      </div> <!-- modal-dialog -->
    `;

    $('#' + _id).html(html).modal();
}


/** legend html for both ALC2 and CSCP  */

    var html_legend_cscp =`
    <div class="d-flex flex-row justify-content-center">
       <h5>${gettext("Suitability")}</h5>
    </div>
    <div class="d-flex flex-row">
      <div class="d-flex flex-column">
          <div d-flex flex-row>
            <svg width="20" height="20">
              <circle fill="#bfbdb0" r="10" cx="10" cy="10"></circle>
            </svg>
            0  ${gettext("Unsuitable")}
          </div>
          <div>
            <svg width="20" height="20">
              <circle fill="#00ea0b" r="10" cx="10" cy="10"></circle>
            </svg> 
            1  ${gettext("Suitable")}
          </div>
          <div>
            <svg width="20" height="20">
              <circle fill="#ff9827" r="10" cx="10" cy="10"></circle>
            </svg>
            2  ${gettext("Limited suitability")}
          </div>
      </div>
    </div>`;
    
    var html_legend_alc2 =`
    <div class="d-flex flex-row justify-content-center">
       <h5>${get_transtext("crops_alc_legened_title")}</h5>
    </div>
    <div class="d-flex flex-row">
        <div class="d-flex flex-column">
            <div d-flex flex-row>
              <svg width="20" height="20">
                <circle fill="#0182fe" r="10" cx="10" cy="10"></circle>
              </svg>
              ${get_transtext("crops_alc_excellent")}
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#c1f9ff" r="10" cx="10" cy="10"></circle>
              </svg> 
              ${get_transtext("crops_alc_very_good")}
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#008200" r="10" cx="10" cy="10"></circle>
              </svg>
              ${get_transtext("crops_alc_good")}
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#a7fca4" r="10" cx="10" cy="10"></circle>
              </svg>
              ${get_transtext("crops_alc_moderate")}
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#fbfa65" r="10" cx="10" cy="10"></circle>
              </svg>
              ${get_transtext("crops_alc_poor")}
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#b4875e" r="10" cx="10" cy="10"></circle>
              </svg>
              ${get_transtext("crops_alc_very_poor")}
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#fec355" r="10" cx="10" cy="10"></circle>
              </svg>
              ${get_transtext("crops_alc_non_agricultural")}
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#fe6256" r="10" cx="10" cy="10"></circle>
              </svg>
              ${get_transtext("crops_alc_urban")}
            </div>
        </div>
    </div>`;


export {add_sidebar, add_intro_modal, html_legend_alc2, html_legend_cscp};
