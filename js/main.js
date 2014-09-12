/**
 * Author: davibq@gmail.com
 * Main js file for crautos Chrome extension. 
 */

(function($) {

	/**
	 * Constants
	 */
	var RMAX = 30,
		DETAIL_URL = './economicos-useddetail.cfm'
		DESIRED_DATA_AMOUNT = 13;

	/**
	 * Method in charge of making the AJAX call to the page
	 * @param  {String} pLink Link to call
	 * @return {Promise}
	 */
	function callPage(pLink) {
		// Example of pLink: javascript:det('36603321')
		pLink = pLink.replace("javascript:det('", '');
		var carId = pLink.replace("')", '');
		if (carId) {
			return $.ajax({
				type: 'POST',
				url: DETAIL_URL,
				data: { 
					rmax: RMAX,
					c: carId
				}
			});
		} else {
			return null;
		}
		
	}

	/**
	 * Interprets the data that comes from the AJAX call and paint the results
	 * @param  {String} pData String containing the HTML of the called page
	 * @return {void}
	 */
	function interpretData(pData) {
		if (pData) {
			var html = [];
			$(pData).find('.round_bdr2[bgcolor="#ffffff"]').find('.miequip').each(function(pIndex) {
				if (pIndex > DESIRED_DATA_AMOUNT) return;
				html.push('<div>'+$(this).html().replace(/&nbsp;/g, '')+'</div>');
			});
			$('#popup').html(html.join(''));
		}
	}

	/**
	 * Default exception handling
	 */
	function error(param1, responseMsg) {
		console.log(responseMsg);
	}

	/**
	 * Initial function. Called when page ready.
	 * @return {[type]}
	 */
	function init() {
		$('body').append('<div id="popup"></div>');
		$('form[action="economicos-ucompare.cfm"] tr td a').on('mouseover', function(event) {
			callPage(event.currentTarget.href)
			.done(interpretData)
			.fail(error);
		});
	}

	$(init);
	
})(jQuery);