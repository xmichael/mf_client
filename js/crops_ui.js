/* dictionary of words */
var en2cy = {
    "Select a crop":"Dewiswch gnwd",
    "Barley":"Haidd",
    "Cabbage":"Bresych",
    "Hops":"Hopys",
    "Kale":"Cêl",
    "Leeks":"Cennin",
    "Oats":"Ceirch",
    "Potatoes":"Tatws",
    "Rye":"Rhyg",
    "Wheat":"Gwenith",
    "Willow commercial":"Helyg masnachol",
    "Willow environmental":"Helyg amgylcheddol"	
};

/* will return the submitted English text in right language
*  according to lang=XX parameter and the dictionary of supplied
*  translations
*/

function gettext( text ){
    
    if (window.location.search=="?lang=cy"){
	if (en2cy.hasOwnProperty(text)){
	    return en2cy[text];
	}
    }
    // return English text if no translation is available
    return text;
}

var html_template=`
          <fieldset id="fieldset_crops">
	    <label for="crops">${gettext("Select a crop")}:</label>
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
	    <p>Future greenhouse gas emissions:</p>
	    <input type="radio" id="low" name="scenario" value="low" checked>
	    <label for="low">Low</label><br>
	    <input type="radio" id="medium" name="scenario" value="medium">
	    <label for="medium">Medium</label><br>
	    <input type="radio" id="high" name="scenario" value="high">
	    <label for="high">High</label>
	    <hr/>
	  <!-- </fieldset> -->
	  <!-- <fieldset id="fieldset_year"> -->
	    <P>Year:</p>
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
    var html = "";
    if (window.location.search=="?lang=cy"){
	html = `
      <!-- modal-{sm,lg,xl} -->
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Cnydau</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>
                Archwiliwch sut y rhagwelir y bydd addasrwydd tir Cymru ar gyfer tyfu deg cnwd
                (gweler y rhestr sydd yn disgyn) yn newid yn y dyfodol yn ôl a fydd sefyllfa allyriadau
                Nwyon Tŷ Gwydr isel, canolig neu uchel yn dod i ben
              </p>
              <p>
                Cymharwch â&#39;r map Dosbarthiad Tir Amaethyddol Rhagfynegol cyfredol sy&#39;n graddio
                ansawdd tir amaethyddol yn yr ardal
              </p>
            </div>
          </div>
       </div>
      </div> <!-- modal-dialog -->
    `;
    }
    else{
	html = `
      <!-- modal-{sm,lg,xl} -->
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Crops</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>
Explore how the suitability of Welsh land for growing ten crops (see the dropdown list) is
predicted to change in the future according to whether low, medium or high Greenhouse
Gas emission scenarios come to pass
              </p>
              <p>
Compare with the current Predictive Agricultural Land Classification map grading the
quality of agricultural land in the area
              </p>
            </div>
          </div>
       </div>
      </div> <!-- modal-dialog -->
    `;
    }
    $('#' + _id).html(html).modal();
}


/** legend html for both ALC2 and CSCP  */

    var html_legend_cscp =`
    <div class="d-flex flex-row justify-content-center">
       <h5>CSCP Suitability</h5>
    </div>
    <div class="d-flex flex-row">
      <div class="d-flex flex-column">
          <div d-flex flex-row>
            <svg width="20" height="20">
              <circle fill="#bfbdb0" r="10" cx="10" cy="10"></circle>
            </svg>
            0  Unsuitable
          </div>
          <div>
            <svg width="20" height="20">
              <circle fill="#00ea0b" r="10" cx="10" cy="10"></circle>
            </svg> 
            1  Suitable
          </div>
          <div>
            <svg width="20" height="20">
              <circle fill="#ff9827" r="10" cx="10" cy="10"></circle>
            </svg>
            2  Limited suitability
          </div>
      </div>
    </div>`;
    
    var html_legend_alc2 =`
    <div class="d-flex flex-row justify-content-center">
       <h5>Predictive ALC grades</h5>
    </div>
    <div class="d-flex flex-row">
        <div class="d-flex flex-column">
            <div d-flex flex-row>
              <svg width="20" height="20">
                <circle fill="#0182fe" r="10" cx="10" cy="10"></circle>
              </svg>
              Excellent quality agr. land
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#c1f9ff" r="10" cx="10" cy="10"></circle>
              </svg> 
              Very good quality agr. land
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#008200" r="10" cx="10" cy="10"></circle>
              </svg>
              Good quality agr. land
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#a7fca4" r="10" cx="10" cy="10"></circle>
              </svg>
              Moderate quality agr. land
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#fbfa65" r="10" cx="10" cy="10"></circle>
              </svg>
              Poor quality agr. land
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#b4875e" r="10" cx="10" cy="10"></circle>
              </svg>
              Very poor quality agr. land
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#fec355" r="10" cx="10" cy="10"></circle>
              </svg>
              Non-agricultural
            </div>
            <div>
              <svg width="20" height="20">
                <circle fill="#fe6256" r="10" cx="10" cy="10"></circle>
              </svg>
              Urban
            </div>
        </div>
    </div>`;


export {add_sidebar, add_intro_modal, html_legend_alc2, html_legend_cscp};
