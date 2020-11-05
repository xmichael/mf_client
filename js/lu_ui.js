import {gettext, get_transtext} from './mf_i18n.js';

/** legend html for LU  */


var html_legend_lu =`
      <div class="d-flex flex-row justify-content-center">
        <h5>${get_transtext("lu_land_use")}</h5>
      </div>
      <div class="d-flex flex-row">
          <div class="d-flex flex-column mr-3 border-right">
                <div>
                  <svg width="20" height="20">
                    <circle fill="#be9b6c" r="10" cx="10" cy="10"></circle>
                  </svg>
                  ${get_transtext("lu_arable")}
                </div>
                <div>
                  <svg width="20" height="20">
                    <circle fill="#fefb69" r="10" cx="10" cy="10"></circle>
                  </svg> ${get_transtext("lu_pasture")}
                </div>
                <div>
                  <svg width="20" height="20">
                    <circle fill="#17d41a" r="10" cx="10" cy="10"></circle>
                  </svg> ${get_transtext("lu_meadow")}
                </div>
                <div>
                  <svg width="20" height="20">
                    <circle fill="#018100" r="10" cx="10" cy="10"></circle>
                  </svg> ${get_transtext("lu_woodland")}
                </div>
                <div>
                  <svg width="20" height="20">
                    <circle fill="#e21ddc" r="10" cx="10" cy="10"></circle>
                  </svg> ${get_transtext("lu_settlement")}
                </div>
                <div>
                  <svg width="20" height="20">
                    <circle fill="#327eef" r="10" cx="10" cy="10"></circle>
                  </svg> ${get_transtext("lu_water")}
                </div>
                <div>
                  <svg width="20" height="20">
                    <circle fill="#f6b26b" r="10" cx="10" cy="10"></circle>
                  </svg> ${get_transtext("lu_common")}
                </div>
                <div>
                  <svg width="20" height="20">
                    <circle fill="#53ccbc" r="10" cx="10" cy="10"></circle>
                  </svg> ${get_transtext("lu_upland")}
                </div>
          </div>
    </div>
`;

export {html_legend_lu};
