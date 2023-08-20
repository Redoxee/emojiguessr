const bxios = {
	create : function(options) {
		const uri = options.baseURL;

		const request = async function(route, data, method) {

			const init = {
				method, // *GET, POST, PUT, DELETE, etc.
				mode: "cors", // no-cors, *cors, same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "same-origin", // include, *same-origin, omit
				redirect: "follow", // manual, *follow, error
				referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			};
			
			if (data) {

				init.headers = {
					"Content-Type": "application/json",
				};

				init.body = JSON.stringify(data); // body data type must match "Content-Type" header
			}
			
			// Default options are marked with *
			const response = await fetch(uri + (route || ""), init);
			const responseJson = await response.json(); // parses JSON response into native JavaScript objects
			return {data : responseJson};
		};

		const bxios = {
			get : async function(route, data) {
				return await request(route, data, "GET");
			},

			put : async function(route, data ) {
				return await request(route, data, "PUT");
			},

			post : async function(route, data ) {
				return await request(route, data, "POST");
			},
		}

		return bxios;
	}
}