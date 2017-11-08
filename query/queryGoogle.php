<?php
/**
 * This page mainly acts as a shim between google's API and our html page so that
 * we don't expose our API key.
 * @author Christopher Bitler
 */

const ELECTIONS_API = "https://www.googleapis.com/civicinfo/v2/elections?key=%s";
const VOTER_INFO_API = "https://www.googleapis.com/civicinfo/v2/voterinfo?key=%s&address=%s&electionId=%s";
const API_KEY = "API-Key-Here";

/**
 * Query google's api for a list of elections and return it for parsing on the client-side
 * @return bool|string
 */
function queryElections() {
    $data = file_get_contents(sprintf(ELECTIONS_API, API_KEY));
    return $data;
}

/**
 * Query google's api for voter-related information given an address and election number
 * @param $electionNumber string Election ID from google
 * @param $address string User provided address
 * @return bool|string
 */
function queryVoterInfo($electionNumber, $address) {
    $address = urlencode($address);
    $data = file_get_contents(sprintf(VOTER_INFO_API, API_KEY, $address, $electionNumber));
    return $data;
}


if ($_POST['type'] === 'elections') {
    echo queryElections();
} elseif ($_POST['type'] === 'voterInfo') {
    $electionId = $_POST['electionId'];
    $address = $_POST['address'];
    echo queryVoterInfo($electionId, $address);
}