import {
  getSolidDataset,
  getThing,
  getThingAll,
  setThing,
  getStringNoLocale,
  setStringNoLocale,
  saveSolidDatasetAt,
  getFile,
  isRawData,
  getContentType,
  getSourceUrl,
  getInteger,
  setInteger,
  getDecimal,
  setDecimal,
  getPublicAccess,
  getAgentAccess
} from "@inrupt/solid-client";
import { Session, handleIncomingRedirect, login, fetch, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { VCARD } from "@inrupt/vocab-common-rdf";

const buttonLogin = document.getElementById("btnLogin");
const writeForm = document.getElementById("writeForm");
const readForm = document.getElementById("readForm");
const infoButton = document.getElementById("infoButton");
const folderSubmit = document.getElementById("btnLinkSubmit");
var session; // = new Session();
var webID = "";
var folderLocation = "";

const turtledatei = "https://alexh156.solidcommunity.net/Splitspense/splitspense.ttl";


function loginToWebProvider(webIDProvider) {
  login({
    oidcIssuer: webIDProvider,
    redirectUrl: window.location.href,
    clientName: "Splitspense"
  });
  return
}
buttonLogin.onclick = function () {
  const webIDProvider = document.getElementById("dropdownID").value;
  loginToWebProvider(webIDProvider);
};

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();

  session = getDefaultSession();
  console.log(session.info.isLoggedIn + "1");
  if (session.info.isLoggedIn) {
    webID = session.info.webId.replace("https://", "").replace("http://", "").split(".")[0];
    document.getElementById(
      "labelStatus"
    ).innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
    document.getElementById("labelStatus").setAttribute("role", "alert");
    const myDataset = await getSolidDataset(turtledatei, { fetch: fetch });
    const profile = getThing(myDataset, turtledatei);
    const allmembers = getStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/members");
    const groupinformation = getStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/information");

    document.getElementById("group_value").value = allmembers;
    document.getElementById("groupinformation").innerHTML = "Group description: " + groupinformation;
    console.log("webid gepseichert");
  }
  console.log(session.info.isLoggedIn + "2");
}
handleRedirectAfterLogin();
async function logintest() {
  console.log(session.info.isLoggedIn);

}

// 2. Write to profile
async function writeProfile() {
  const name = document.getElementById("input_name").value;

  if (!session.info.isLoggedIn) {
    // You must be authenticated to write.
    document.getElementById(
      "labelWriteStatus"
    ).textContent = `...you can't write [${name}] until you first login!`;
    document.getElementById("labelWriteStatus").setAttribute("role", "alert");
    return;
  }
  const webID = session.info.webId;
  // The WebID can contain a hash fragment (e.g. `#me`) to refer to profile data
  // in the profile dataset. If we strip the hash, we get the URL of the full
  // dataset.
  const profileDocumentUrl = new URL(webID);
  profileDocumentUrl.hash = "";

  // To write to a profile, you must be authenticated. That is the role of the fetch
  // parameter in the following call.
  let myProfileDataset = await getSolidDataset(profileDocumentUrl.href, {
    fetch: session.fetch
  });

  // The profile data is a "Thing" in the profile dataset.
  let profile = getThing(myProfileDataset, webID);

  // Using the name provided in text field, update the name in your profile.
  // VCARD.fn object is a convenience object that includes the identifier string "http://www.w3.org/2006/vcard/ns#fn".
  // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#fn" string instead of VCARD.fn.
  profile = setStringNoLocale(profile, VCARD.fn, name);

  // Write back the profile to the dataset.
  myProfileDataset = setThing(myProfileDataset, profile);

  // Write back the dataset to your Pod.
  await saveSolidDatasetAt(profileDocumentUrl.href, myProfileDataset, {
    fetch: session.fetch
  });

  // Update the page with the retrieved values.
  document.getElementById(
    "labelWriteStatus"
  ).textContent = `Wrote [${name}] as name successfully!`;
  document.getElementById("labelWriteStatus").setAttribute("role", "alert");
  document.getElementById(
    "labelFN"
  ).textContent = `...click the 'Read Profile' button to to see what the name might be now...?!`;
}

async function writeData(){
  if (session.info.isLoggedIn == false) {
    alert("You are not logged in. To continue please login.");
  }
  else {
    const value = document.getElementById("input_value").valueAsNumber;
    // 1a. Start with an existing Thing (i.e., profile).
    // Note: Login code has been omitted for brevity. See the Prerequisite section above.
    // ...

    const myDataset = await getSolidDataset( turtledatei, { fetch: fetch });
    const profile = getThing( myDataset, turtledatei);;
    // 1b. Modify the thing; 
    // Note: solid-client functions do not modify objects passed in as arguments. 
    // Instead the functions return new objects with the modifications.
    // That is, setStringNoLocale and addStringNoLocale return a new Thing and
    // - profile remains unchanged and 
    // - updatedProfile is changed only because it is explicitly set to the object returned from addStringNoLocale.
    const tt = getStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/members");
    const members = tt.split(",");
    const membercount = members.length;
    //const admin = getStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/admin");
    for (var i in members){
      var newInt = 0.0;
      if (members[i] == webID){
        newInt = -value/membercount*(membercount-1) + await getBalance(members[i]);
      }
      else{
        newInt = value/membercount + await getBalance(members[i]);
      }

      let updatedProfile = setDecimal(profile, "https://alexh156.solidcommunity.net/Splitspense/" +members[i], newInt);
      //updatedProfile = addStringNoLocale(updatedProfile, FOAF.nick, "docs");
      //updatedProfile = addStringNoLocale(updatedProfile, FOAF.nick, "example");

      // 2. Update SolidDataset with the updated Thing (i.e., updatedProfile). 
      // Note:  solid-client functions do not modify objects passed in as arguments. 
      // Instead the functions return new objects with the modifications.
      // That is, setThing returns a new SolidDataset and
      // - myDataset remains unchanged.
      // - updatedProfile remains unchanged.

      const myChangedDataset = setThing(myDataset, updatedProfile);
      // 3. Save the new dataset.
      // The fnuction returns a SolidDataset that reflects its state after the save.
      const savedProfileResource = await saveSolidDatasetAt(
        turtledatei,
        myChangedDataset,
        { fetch: fetch }
      );
    }
    //update history
    var today = new Date().toLocaleDateString();
    const oldhistory = getStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/" + "history");
    const newhistory = webID.toString() + " paid " + document.getElementById("input_value").value + "€ for " + document.getElementById("input_comment").value + " on " + today + ";" + oldhistory;

    let updatedProfile = setStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/history", newhistory);
    const myChangedDataset = setThing(myDataset, updatedProfile);
    const savedProfileResource = await saveSolidDatasetAt(
      turtledatei,
      myChangedDataset,
      { fetch: fetch }
    );
  }
}

// 3. Read profile
async function readProfile() {
  const webID = document.getElementById("webID").value;

  if (webID === NOT_ENTERED_WEBID) {
    document.getElementById(
      "labelFN"
    ).textContent = `Login first, or enter a WebID (any WebID!) to read from its profile`;
    return false;
  }

  try {
    new URL(webID);
  } catch (_) {
    document.getElementById(
      "labelFN"
    ).textContent = `Provided WebID [${webID}] is not a valid URL - please try again`;
    return false;
  }

  const profileDocumentUrl = new URL(webID);
  profileDocumentUrl.hash = "";

  // Profile is public data; i.e., you do not need to be logged in to read the data.
  // For illustrative purposes, shows both an authenticated and non-authenticated reads.

  let myDataset;
  try {
    if (session.info.isLoggedIn) {
      myDataset = await getSolidDataset(profileDocumentUrl.href, { fetch: session.fetch });
    } else {
      myDataset = await getSolidDataset(profileDocumentUrl.href);
    }
  } catch (error) {
    document.getElementById(
      "labelFN"
    ).textContent = `Entered value [${webID}] does not appear to be a WebID. Error: [${error}]`;
    return false;
  }

  const profile = getThing(myDataset, webID);

  // Get the formatted name (fn) using the property identifier "http://www.w3.org/2006/vcard/ns#fn".
  // VCARD.fn object is a convenience object that includes the identifier string "http://www.w3.org/2006/vcard/ns#fn".
  // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#fn" string instead of VCARD.fn.

  const formattedName = getStringNoLocale(profile, VCARD.fn);

  // Update the page with the retrieved values.
  document.getElementById("labelFN").textContent = `[${formattedName}]`;
}

async function getBalance(name) {
  if (session.info.isLoggedIn == false) {
    alert("You are not logged in. To continue please login.");
  }
  else {
    const myDataset = await getSolidDataset(
      turtledatei, {
      fetch: fetch
    });
    const profile = getThing(
      myDataset,
      turtledatei
    );
    const fn = getDecimal(profile, "https://alexh156.solidcommunity.net/Splitspense/" + name);
    return fn;
  }
}

async function getAllBalances() {
  if (session.info.isLoggedIn == false) {
    alert("You are not logged in. To continue please login.");
  }
  else {
    const myDataset = await getSolidDataset(
      turtledatei, {
      fetch: fetch
    });
    const profile = getThing(
      myDataset,
      turtledatei
    );
    var output = "";
    const mm = getStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/" + "members");
    const members = mm.split(",");
    members.forEach(member => output+=member.toString()+": "+ getDecimal(profile, "https://alexh156.solidcommunity.net/Splitspense/" + member) + "\n");
    const hh = getStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/" + "history");
    const history = hh.split(";");
    output += "\nHistory: \n"
    history.forEach(his => output+=his.toString() + "\n");
  
    document.getElementById("labelFN").textContent = output;
  }
}

async function updateGroup() {
  if (session.info.isLoggedIn == false) {
    alert("You are not logged in. To continue please login.");
  }
  else {
    const myDataset = await getSolidDataset(
      turtledatei, {
      fetch: fetch
    });
    const profile = getThing(
      myDataset,
      turtledatei
    );

    let updatedProfile = setStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/members", document.getElementById("group_value").value);
    const myChangedDataset = setThing(myDataset, updatedProfile);
    const savedProfileResource = await saveSolidDatasetAt(
      turtledatei,
      myChangedDataset,
      { fetch: fetch }
    );
  }
}


writeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //writeProfile();
  writeData();
});

readForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //readProfile();
  //readFileFromPod(document.getElementById("labelFN"));
  getAllBalances();
});

groupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //readProfile();
  //readFileFromPod(document.getElementById("labelFN"));
  updateGroup();
});

async function folderSubmitfunc() {
  folderLocation = document.getElementById("folderLink").value;
  console.log(folderLocation);
  }

folderSubmit.onclick = function () {
  folderSubmitfunc();
  console.log(folderLocation);
}

infoButton.onclick = function () {
  console.log(webID + ":WebID");
  console.log(session.login.isLoggedIn);
  logintest();
}



// const resource = "https://nilskl.inrupt.net/Spitspense%20Folder/";
// const agent = "https://nilskl.inrupt.net/profile/card#me";
//  var access = {
//    read: false,
//    append: false,
//    write: false,
//    controlRead: false,
//    controlWrite: false
//  }; 


// getAgentAccess(
//   "https://nilskl.inrupt.net/Spitspense%20Folder/",       // resource  
//   "https://nilskl.inrupt.net/profile/card#me",  // agent
//   { fetch: fetch }                      // fetch function from authenticated session
// ).then(access => {
//   logAccessInfo("https://nilskl.inrupt.net/profile/card#me", access, "https://nilskl.inrupt.net/Spitspense%20Folder/");
// });

// function logAccessInfo(agent, access, resource) {
//   if (access === null) {
//     console.log("Could not load access details for this Resource.");
//   } else {
//     console.log(`${agent}'s Access:: `, JSON.stringify(access));
//     console.log("...", agent, (access.read ? 'CAN' : 'CANNOT'), "read the Resource", resource);
//     console.log("...", agent, (access.append ? 'CAN' : 'CANNOT'), "add data to the Resource", resource);
//     console.log("...", agent, (access.write ? 'CAN' : 'CANNOT'), "change data in the Resource", resource);
//     console.log("...", agent, (access.controlRead ? 'CAN' : 'CANNOT'), "see access to the Resource", resource);
//     console.log("...", agent, (access.controlWrite ? 'CAN' : 'CANNOT'), "change access to the Resource", resource);
//   }
// }

// // 1a. Start Login Process. Call session.login() function.
// async function loginOld() {
//   if (!session.info.isLoggedIn) {
//     await session.login({
//       oidcIssuer: SOLID_IDENTITY_PROVIDER,
//       clientName: "Inrupt tutorial client app",
//       redirectUrl: window.location.href
//     });
//   }
// }

// // 1b. Login Redirect. Call session.handleIncomingRedirect() function.
// // When redirected after login, finish the process by retrieving session information.
// async function handleRedirectAfterLogin() {
//   await session.handleIncomingRedirect(window.location.href);
//   if (session.info.isLoggedIn) {
//     // Update the page with the status.
//     document.getElementById(
//       "labelStatus"
//     ).innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
//     document.getElementById("labelStatus").setAttribute("role", "alert");
//   }
// }

// The example has the login redirect back to the index.html.
// This calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.
//handleRedirectAfterLogin();


// If your Pod is *not* on `solidcommunity.net`, change this to your identity provider.
// const SOLID_IDENTITY_PROVIDER = "https://solidcommunity.net";
// document.getElementById(
//   "solid_identity_provider"
//   ).innerHTML = `[<a target="_blank" href="${SOLID_IDENTITY_PROVIDER}">${SOLID_IDENTITY_PROVIDER}</a>]`;

// const NOT_ENTERED_WEBID =
//   "...not logged in yet - but enter any WebID to read from its profile...";

// const session = new Session(); //löschen?

  // Read file from Pod 

//   async function readFileFromPod(fileURL) {
//   try {
//     // file is a Blob (see https://developer.mozilla.org/docs/Web/API/Blob)
//     //const file = await getFile(
//     //  fileURL,               // File in Pod to Read
//               // fetch from authenticated session
//     //);

//     //console.log( `Fetched a ${getContentType(file)} file from ${getSourceUrl(file)}.`);
//     //console.log(`The file is ${isRawData(file) ? "not " : ""}a dataset.`);
//     //console.log(file)
//     //var reader = new FileReader();
//     //reader.addEventListener("loadend", function() {
//     // reader.result beinhaltet den Inhalt des Blobs
//     //});
//     //reader.readAsArrayBuffer(file);
//     //var test = reader.result;

//     console.log("test2");
//     const myDataset = await getSolidDataset(
//       turtledatei,{ 
//       fetch: fetch 
//     });
//     const profile = getThing(
//       myDataset,
//       "<>"
//     );
//     console.log("test")
//     console.log(getStringNoLocale(profile, "<http://creativecommons.org/ns#attributionName>"));
//     //const fn = getStringNoLocale(file, "http://creativecommons.org/ns#attributionName");
//     //console.log(fn)

//     } catch (err) {
//     console.log(err);
//   }
// }
// async function newtest(){
//   // 1. Call the handleIncomingRedirect() function,
//   //    - Which completes the login flow if redirected back to this page as part of login; or
//   //    - Which is a No-op if not part of login.
//   await handleIncomingRedirect();

//   // 2. Start the Login Process if not already logged in.
//   if (!getDefaultSession().info.isLoggedIn) {
//     await login({
//       oidcIssuer: "https://solidcommunity.net/",
//       redirectUrl: window.location.href,
//       clientName: "My application"
//     });
//   }

//   // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
//   // For example, the user must be someone with Read access to the specified URL.
//   const myDataset = await getSolidDataset(
//     turtledatei, {
//     fetch: fetch
//   });
//   const profile = getThing(
//     myDataset,
//     turtledatei
//   );
//   //console.log(profile.predicates["https://alexh156.solidcommunity.net/Splitspense/nils"].literals["http://www.w3.org/2001/XMLSchema#integer"][0]);
//   const fn = getInteger(profile, "https://alexh156.solidcommunity.net/Splitspense/nils");
//   //const acquaintances = getUrlAll(profile, FOAF.knows);
//   console.log(fn);
// }