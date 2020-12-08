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
    "op_intro_html" : [`<p class="small">
                        <i>This interactive map shows the opportunities for growing crops in the Dyfi Biosphere, field by field. The darker the field colour,                         the greater the opportunity. A high opportunity score favours cultivation, based upon the combination of three factors:</i>
                         </p>
                         <span class="small">1. <b>Historic use</b>: If a field was under cultivation in 1840, that suggests it might be suitable again and would increase the opportunity.</span><br/>
                         <span class="small">2. <b>Carbon storage</b>: This refers to the carbon that is stored in vegetation, whether grass, crops or woodland. For example, cereals hold very little carbon compared to woodland. The map therefore gives a high score to fields that would not negatively affect carbon storage if they were lost or converted to arable.</span><br/>
                         <span class="small">3. <b>The risk of soil erosion</b>: Steep slopes that have little to no vegetation cover present a greater risk of soil erosion compared to shallow slopes with good vegetation cover, such as woodland and shrubland. Ploughing grassland (or felling trees) to grow crops exposes the soil to wind and rain, leading to erosion and increasing the risk of flooding. Fields that have a lower risk from soil erosion will have a higher opportunity score.</span>`,
                        `<p class="small">
                        <i>Mae'r map rhyngweithiol hwn yn dangos y cyfleoedd i dyfu cnydau ym Miosffer Dyfi, fesul cae. Po dywyllaf yw lliw'r cae, y mwyaf yw'r cyfle. Mae sgôr cyfle uchel yn ffafrio tyfu cnydau, yn seiliedig ar y cyfuniad o dri ffactor:</i>
                         </p>
                         <span class="small">1. <b>Defnydd hanesyddol</b>: Pe bai cae yn cael ei drin yn 1840, mae hynny'n awgrymu y gallai fod yn addas eto a byddai'n cynyddu'r cyfle.</span><br/>
                         <span class="small">2. <b>Storio carbon</b>: Mae hyn yn cyfeirio at y carbon sy'n cael ei storio mewn llystyfiant, p'un a yw'n laswellt, cnydau neu goetir. Er enghraifft, ychydig iawn o garbon sydd gan rawnfwydydd o'i gymharu â choetir. Felly mae'r map yn rhoi sgôr uchel i gaeau na fyddai'n effeithio'n negyddol ar storio carbon pe byddent yn cael eu colli neu eu troi'n dir âr.</span><br/>
                         <span class="small">3. <b>Y risg o erydiad pridd</b>: Mae llethrau serth sydd heb fawr o orchudd llystyfiant yn peri mwy o risg o erydiad pridd o'i gymharu â llethrau bas gyda gorchudd llystyfiant da, fel coetir a phrysgwydd. Mae aredig glaswelltir (neu gwympo coed) i dyfu cnydau yn dinoethi'r pridd i wynt a glaw, gan arwain at erydiad a chynyddu'r risg o lifogydd. Bydd gan gaeau sydd â risg is o erydiad pridd gyda sgôr cyfle uwch.</span>`],
    "op_highest" : [ "Highest", "Uchaf" ],
    "op_lowest" : [ "Lowest", "Isaf" ],
    "op_opp_score" : [ "Opportunity score", "Sgôr cyfle" ],
    "op_erosion_risk" : [ "Erosion risk", "Risg erydiad" ],
    "op_carbon_risk" : [ "Carbon risk", "Risg carbon" ],
    "op_erosion_score" : [ "Erosion score", "Sgôr erydiad" ],
    "op_carbon_score" : [ "Carbon score", "Sgôr carbon" ],
    "op_historical_score" : [ "Historical score", "Sgôr Hanesyddol" ],
    "op_score_calculation" : [ "Score Calculation", "Cyfrifo Sgôr" ],
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
    "hi_intro_body":[`<p>Click on an icon and listen to the recollections (in Welsh) of older generation farmers in Bro Ddyfi - who have seen many significant changes in their lifetimes and often recall when agriculture in the area was more mixed. Limited transcripts in English also available.</p>`,`<p>Cliciwch ar eicon a gwrandewch ar atgofion (yn Gymraeg) ffermwyr cenhedlaeth hŷn yn Bro Ddyfi - sydd wedi gweld llawer o newidiadau sylweddol yn eu hoes ac yn aml yn cofio pan oedd amaethyddiaeth yn yr ardal yn fwy cymysg. Trawsgrifiadau cyfyngedig yn Saesneg ar gael hefyd.</p>`],
    "food_intro_title":['Producers &amp; Distributors','Cynhyrchwyr a Dosbarthwyr'],
    "food_intro_body":[`<p>The map shows enterprises (click on icons for detail) involved in the local Bro Ddyfi
		  food system - the emphasis is on produce grown, sold and consumed in the local area
		  using agroecological practices.
		  For us, it’s important to build the local food economy and develop the local market. It
		  helps address the climate crisis, improves food security and, if grown using non intensive,
		  nature friendly agroecological methods, helps address the loss of biodiversity in Wales.</p>

               <p>If you would like to discuss having your business added, please get in touch.</p>`,
		  `<p>Mae&#39;r map yn dangos mentrau (cliciwch ar eiconau am fanylion) sy&#39;n ymwneud â system
		   fwyd leol Bro Ddyfi - mae&#39;r pwyslais ar gynnyrch sy&#39;n cael ei dyfu, ei werthu a&#39;i fwyta yn
		   yr ardal leol gan ddefnyddio arferion agroecolegol.
		   I ni, mae&#39;n bwysig adeiladu&#39;r economi fwyd leol a datblygu&#39;r farchnad leol. Mae&#39;n helpu i
		   fynd i&#39;r afael â&#39;r argyfwng hinsawdd, yn gwella diogelwch bwyd ac, os caiff ei dyfu gan
		   ddefnyddio dulliau agroecolegol nad ydynt yn ddwys, sy&#39;n gyfeillgar i natur, mae&#39;n helpu
		   i fynd i&#39;r afael â cholli bioamrywiaeth yng Nghymru.</p>
		   <p>Os hoffech drafod ychwanegu eich busnes, cysylltwch â ni.</p>`
		      ],
    "food_click_on_food_icon":['Click on a <b>food or store</b> icon','Cliciwch ar eicon bwyd neu siop'],
    "food_produce":['Produce','Cynnyrch'],
    "food_description":['Description','Disgrifiad'],
    "food_pictures":['Pictures','Lluniau'],
    "food_contact":['Contact','Cyswllt'],
    "food_follow":['Follow','Dilyn'],
    "food_homepage":['homepage','hafan']
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
