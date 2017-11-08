/**
 * @author Christopher Bitler
 */

/**
 * Object with methods for querying elections and showing the polling location
 * map.
 */
var api = new function() {
    /**
     * Query the list of elections from google via our php query page
     */
    this.queryElections = function () {
        var data = {
            type: 'elections'
        };
        $.post("query/queryGoogle.php", data, function (data) {
            var parsedData = JSON.parse(data);
            var elections = parsedData.elections;
            elections.forEach(function (element) {
                if (element.name !== "VIP Test Election") {
                    $('#elections').append($('<option>', {
                        value: element.id,
                        text: element.name
                    }));
                }
            });
        });
    };

    /**
     * Query the voter's info from google using their input and display the map
     * of the polling location if there is one.
     */
    this.queryVoterInfo = function () {
        var electionID = $("#elections").val();
        var address = $("#address-input").val();
        var data = {
            type: 'voterInfo',
            electionId: electionID,
            address: address
        };

        $.post("query/queryGoogle.php", data, function (data) {
            var parsedData = JSON.parse(data);
            if(parsedData.pollingLocations !== undefined) {
                var pollingLocation = parsedData.pollingLocations[0];
                var normalized = parsedData.normalizedInput;
                var pollingLocationAddress = pollingLocation.address.line1 + ", " + pollingLocation.address.city + ", " + pollingLocation.address.state
                var address = normalized.line1 + "," + normalized.city + "," + normalized.state;
                $("#map").css("display", "block");
                $("#voting-location").html(pollingLocation.address.locationName + ": " + pollingLocationAddress);
                getLatLngForAddressAndInitMap(address, pollingLocationAddress);
            } else {
                $("#response").css("display", "block");
                $("#map").css("display", "none");
                $("#voting-location").html("No polling locations found");
            }
        });
    };
};

$( document ).ready(function() {
    api.queryElections();
    $("#elections").change(function (data) {
        // -9999 is the value for the 'Select an election option'
        if($("#elections").val() != -9999) {
            $("#address-data").css("display", "block");
        } else {
            $("#address-data").css("display", "none");
        }
    });

    $("#address-input").keydown(function (data) {
        //On enter
        if(data.keyCode === 13) {
            api.queryVoterInfo();
        }
    });
});