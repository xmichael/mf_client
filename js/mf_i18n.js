/* Change visibility of all elements that have a class "lang_en" or "lang_cy"
* choose this method when you want to have everything (both languages) in one html page for convenience instead of JSON objects
* this method can obviously only be used after DOM is ready and everything is rendered
* -- s.a.: gettext for short text or get_transtext for paragraphs using js-object based dictonary
*/
function flip_l10n(){
    if (window.location.search=="?lang=cy"){
	$('.lang_cy').show();
	$('.lang_en').hide();
    }
    else{
	$('.lang_en').show();
	$('.lang_cy').hide();
    }
}



/* dictionary of words or short phrases */
var en2cy = {
    "Crops":"Cnydau",
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
    "Willow environmental":"Helyg amgylcheddol"	,
    "Future greenhouse gas emissions":"Allyriadau nwyon tŷ gwydr yn y dyfodol",
    "Low":"Isel",
    "Medium":"Canolig",
    "High":"Uchel",
    "Year":"Blwyddyn",
    "Suitability":"Addasrwydd",
    "Unsuitable":"Anaddas",
    "Suitable":"Addas",
    "Limited suitability":"Addasrwydd cyfyngedig",
    "Predictive ALC map":"Map ALC rhagfynegol",
    "Contemporary":"Cyfoes"
};

/* dictionary of snippets of text */
var transtext = {
    "crops_intro_html" : [ `Explore how the suitability of Welsh land for growing ten crops (see
the dropdown list) is predicted to change in the future according to
whether <mark>low, medium or high Greenhouse Gas emission
scenarios</mark> come to pass <p/> Compare with the current
<mark>Predictive Agricultural Land Classification map grading</mark>
the quality of agricultural land in the area` ,
		     `Archwiliwch sut y rhagwelir y bydd addasrwydd tir Cymru ar gyfer tyfu
deg cnwd (gweler y rhestr sydd yn disgyn) yn newid yn y dyfodol yn ôl
a fydd sefyllfa allyriadau Nwyon Tŷ Gwydr isel, canolig neu uchel yn
dod i ben <p/> Cymharwch â&#39;r map Dosbarthiad Tir Amaethyddol
Rhagfynegol cyfredol sy&#39;n graddio ansawdd tir amaethyddol yn yr
ardal
`],
    "crops_alc_legened_title" : ['Predictive ALC grades', 'Graddau ALC Rhagfynegol'],
    "crops_alc_excellent" : ['Excellent quality agr. land', 'Tir amaeth o ansawdd rhagorol'],
    "crops_alc_very_good" : ['Very good quality agr. land', 'Tir amaeth o ansawdd da iawn'],
    "crops_alc_good" : ['Good quality agr. land', 'Tir amaeth o ansawdd da'],
    "crops_alc_moderate" : ['Moderate quality agr. land', 'Tir amaeth o ansawdd cymedrol'],
    "crops_alc_poor" : ['Poor quality agr. land' ,'Tir amaeth o ansawdd gwael'],
    "crops_alc_very_poor" : ['Very poor quality agr. land', 'Tir amaeth o ansawdd gwael iawn'],
    "crops_alc_non_agricultural" : ["Non-agricultural", "Tir nad yw'n amaethyddol"],
    "crops_alc_urban" : ["Urban", "Trefol"],
    "op_intro_html" : [`<p class="small">This interactive map has been developed
			to allow you to identify fields within the DBR that could
			be <b>suitable for agricultural activity</b> (i.e. where you
			could grow crops). Three important factors have been
			considered when identifying fields suitable for this
			opportunity: how the field was used historically, how
			good the field is at storing carbon and how susceptible
			the field is to erosion. The interactive map allows you
			to chose <b>which factor(s) are of greatest importance to
			you</b> which, in turn, changes which fields are identified
			as greater or lesser opportunities.</p>`,
                        `<p class="small" >Mae'r map rhyngweithiol hwn wedi'i ddatblygu i'ch
			galluogi i nodi caeau o fewn y Gwarchodfa Biosffer Dyfi a allai fod yn
			addas ar gyfer gweithgaredd amaethyddol (h.y. lle y gallech chi dyfu
			cnydau). Ystyriwyd tri ffactor pwysig wrth nodi caeau sy'n addas ar
			gyfer y cyfle hwn: sut y defnyddiwyd y cae yn hanesyddol, pa mor dda
			yw'r cae wrth storio carbon a pha mor agored yw'r cae i erydiad. Mae'r
			map rhyngweithiol yn caniatáu ichi ddewis pa ffactor (ion) sydd
			bwysicaf i chi sydd, yn ei dro, yn newid pa gaeau sy'n cael eu
			hadnabod fel caeau a mwy neu lai o gyfleoedd addas.</p>`],
    "op_highest" : [ "Highest", "Uchaf" ],
    "op_lowest" : [ "Lowest", "Isaf" ],
    "op_opp_score" : [ "Opportunity score", "Sgôr cyfle" ],
    "op_erosion_risk" : [ "Erosion risk", "Risg erydiad" ],
    "op_carbon_risk" : [ "Carbon risk", "Risg carbon" ],
    "op_erosion_score" : [ "Erosion score", "Sgôr erydiad" ],
    "op_carbon_score" : [ "Carbon score", "Sgôr carbon" ],
    "op_historical_score" : [ "Historical score", "Sgôr Hanesyddol" ],
    "op_land_use_now" : [ "land use now", "defnydd tir rwan" ],
    "op_land_use_1840s" : [ "land use 1840s", "defnydd tir 1840au" ],
    "op_map_hover" : [ 'Click on a <b>field</b> for extra info', 'Cliciwch ar <b>gae</b> i gael gwybodaeth ychwanegol' ],
    "op_no_historical_lu_found" : ["No historical arable/pasture landuse found",
				   "Ni ddarganfuwyd unrhyw ddefnydd tir âr / porfa hanesyddol"],
    "lu_land_use" : [ "Land use", "Defnydd Tir" ],
    "lu_1840s" : [ "1840s", "1840au" ],
    "lu_1930s" : [ "1930s", "1930au" ],
    "lu_contemporary" : ["Contemporary", "Cyfredol"],
    "lu_arable" : ["Arable","Tir âr"],
    "lu_pasture" : ["Pasture","Porfa"],
    "lu_meadow" : ["Meadow","Dôl"],
    "lu_woodland" : ["Woodland","Coetir"],
    "lu_settlement" : ["Settlement","Aneddiad"],
    "lu_water" : ["Water","Dŵr"],
    "lu_common" : ["Common","Comin"],
    "lu_upland" : ["Upland","Ucheldir"],
    "hi_keywords" : ["Keywords","Geiriau Allweddol"],
    "hi_description":["Description","Disgrifiad"],
    "hi_clickonmic":["Click on the <b>mic</b> icon","Cliciwch ar yr eicon <b>meicroffon</b>"],
    "hi_see_more":["See more","Gweler mwy"],
    "hi_close":["Close","Cau"],
    "hi_filter":["Filter","Hidlo"],
    "hi_intro_title":["Oral Histories","Hanesion Llafar"],
    "hi_intro_body":[`<p>Click on an icon and listen to the recollections (in Welsh) of older generation farmers in Bro Ddyfi - who have seen many significant changes in their lifetimes and often recall when agriculture in the area was more mixed. Limited transcripts in English also available.</p>`,`<p>Cliciwch ar eicon a gwrandewch ar atgofion (yn Gymraeg) ffermwyr cenhedlaeth hŷn yn Bro Ddyfi - sydd wedi gweld llawer o newidiadau sylweddol yn eu hoes ac yn aml yn cofio pan oedd amaethyddiaeth yn yr ardal yn fwy cymysg. Trawsgrifiadau cyfyngedig yn Saesneg ar gael hefyd.</p>`]
};

/* same as gettext but for long snippets */
function get_transtext (prop){
    if (! transtext.hasOwnProperty(prop)){
	console.log("!!!!No such translation: ",prop); 
	return "";
    }
    if (window.location.search=="?lang=cy"){
	return transtext[prop][1];
    }
    return transtext[prop][0];
}


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

export {gettext, get_transtext, flip_l10n};
