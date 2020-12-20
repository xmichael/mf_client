# About
The Mixed Farming Information Gateway

# Endpoints

The Mixed Farming project provides a collection of web applications available as standalone webapps which can also be embedded in another website (e.g. as an IFRAME). There is also an Information Gateway app that embeds everything in one single portal. Appending `?lang=cy` will switch the interface to the Welsh language.

The following endpoints are available. 

* `all.html`: 
	The Information Gateway &mdash; all the web applications under one portal.
* `histories.html`: 
	A collection oral histories that allows users to listen to the recollections (in Welsh) of older generation farmers in Bro Ddyfi. (audio data are excluded)
* `lu.html`: 
	Historical and contemporary land use comparison allows users to get an impression of how agriculture has changed in the area over the last 200 years. (3rd party datasets are excluded)
* `crops.html`: 
	Explore how the suitability of Welsh land for growing ten common crops is predicted to change in the future according to whether low, medium or high Greenhouse Gas emission scenarios come to pass. (CSCP, ALC2 datasets are excluded)
* `oppportunity_maps_simple.html`: 
        An interactive map that shows the opportunities for growing crops in the Dyfi Biosphere based upon the combination of various factors. (Uses sample carbon/erosion risk datasets)
* `food.html`:
        A *"Producers & Consumers"* mapping application that shows enterprises involved in the local Bro Ddyfi food system with an emphasis on produce grown, sold and consumed in the local area using agroecological practices.(3rd party datasets are excluded)

# Other Endpoints

The following MF web apps are not part of the Information Gateway but are included in this repository as they use the same infrastructure:

* `repair.html`:
	A crowdsourcing app that allows people to fill in missing Land Use data with the help of any submission system that can export CSV (e.g. Google Forms).
* `wt.html`:
	A map visualising the results of a keyword-based inference algorithm for classifying apportionment data according to the Woodland Trust classification. (apportionment data are excluded)

# Third party datasets

Due to licence restrictions, all third party data products must be downloaded separately from their official providers. 

# Deployment (quick start)
 
	python3 -m http.server 8000 --bind 127.0.0.1
