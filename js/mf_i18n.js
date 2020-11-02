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
    "intro_html" : [ `Explore how the suitability of Welsh land for growing ten crops (see
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
`]
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

export {gettext, get_transtext};
