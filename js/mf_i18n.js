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
