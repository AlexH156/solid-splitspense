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
  setInteger
} from "@inrupt/solid-client";
import { Session, handleIncomingRedirect, login, fetch, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { VCARD } from "@inrupt/vocab-common-rdf";


// // If your Pod is *not* on `solidcommunity.net`, change this to your identity provider.
// const SOLID_IDENTITY_PROVIDER = "https://inrupt.net";
// document.getElementById(
//   "solid_identity_provider"
// ).innerHTML = `[<a target="_blank" href="${SOLID_IDENTITY_PROVIDER}">${SOLID_IDENTITY_PROVIDER}</a>]`;

// const NOT_ENTERED_WEBID =
//   "...not logged in yet - but enter any WebID to read from its profile...";

//const session = new Session(); //löschen?

const buttonLogin = document.getElementById("btnLogin");
const writeForm = document.getElementById("writeForm");
const readForm = document.getElementById("readForm");

const turtledatei = "https://alexh156.solidcommunity.net/Splitspense/splitspense.ttl";



function loginToInruptDotNet(webIDProvider) {
  return login({
    oidcIssuer: webIDProvider,
    redirectUrl: window.location.href,
    clientName: "Getting started app"
  });
}

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();

  const session = getDefaultSession();
  if (session.info.isLoggedIn) {
    // Update the page with the status.
    document.getElementById("labelStatus").textContent = "Your Session is logged in";
    document.getElementById("labelStatus").setAttribute("role", "alert");
  }
}
handleRedirectAfterLogin();

buttonLogin.onclick = function() {
  const webIDProvider = document.getElementById("dropdownID").value;
  console.log(webIDProvider);
  loginToInruptDotNet(webIDProvider);
};


// // OldLogin Function
// async function loginAndFetch() {
//   // 1. Call the handleIncomingRedirect() function to complete the authentication process.
//   //   If the page is being loaded after the redirect from the Solid Identity Provider
//   //      (i.e., part of the authentication flow), the user's credentials are stored in-memory, and
//   //      the login process is complete. That is, a session is logged in 
//   //      only after it handles the incoming redirect from the Solid Identity Provider.
//   //   If the page is not being loaded after a redirect from the Solid Identity Provider, 
//   //      nothing happens.
//   await handleIncomingRedirect();

//   // 2. Start the Login Process if not already logged in.
//   if (!getDefaultSession().info.isLoggedIn) {
//     // The `login()` redirects the user to their identity provider;
//     // i.e., moves the user away from the current page.
//     await login({
//       // Specify the URL of the user's Solid Identity Provider; e.g., "https://broker.pod.inrupt.com" or "https://inrupt.net"
//       //oidcIssuer: "https://broker.pod.inrupt.com",
//       oidcIssuer: "https://inrupt.net",
//       // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
//       // e.g., the current page for a single-page app.
//       redirectUrl: window.location.href,
//       // Pick an application name that will be shown when asked 
//       // to approve the application's access to the requested data.
//       clientName: "My application"
//     });
//   }
//   // TODO: Buggy, manchmal aktualisiert der nicht
//   var session = getDefaultSession();
//   if (session.info.isLoggedIn) {
//     // Update the page with the status.
//     document.getElementById(
//       "labelStatus"
//     ).innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
//     document.getElementById("labelStatus").setAttribute("role", "alert");
//   }
// }
// buttonLogin.onclick = function () {
//   //login();
//   loginAndFetch();
//   //newtest();
// };

// 1a. Start Login Process. Call session.login() function.
// async function loginOld() {
//   if (!session.info.isLoggedIn) {
//     await session.login({
//       oidcIssuer: SOLID_IDENTITY_PROVIDER,
//       clientName: "Inrupt tutorial client app",
//       redirectUrl: window.location.href
//     });
//   }
// }



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

async function writeData() {
  const name = document.getElementById("input_name").value;
  const value = document.getElementById("input_value").valueAsNumber;
  // 1a. Start with an existing Thing (i.e., profile).
  // Note: Login code has been omitted for brevity. See the Prerequisite section above.
  // ...

  const myDataset = await getSolidDataset(turtledatei, { fetch: fetch });
  const profile = getThing(myDataset, turtledatei);;
  // 1b. Modify the thing; 
  // Note: solid-client functions do not modify objects passed in as arguments. 
  // Instead the functions return new objects with the modifications.
  // That is, setStringNoLocale and addStringNoLocale return a new Thing and
  // - profile remains unchanged and 
  // - updatedProfile is changed only because it is explicitly set to the object returned from addStringNoLocale.
  const newInt = value + await newtest2(name);
  let updatedProfile = setInteger(profile, "https://alexh156.solidcommunity.net/Splitspense/" + name, newInt);
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

// Read file from Pod 
async function readFileFromPod(fileURL) {
  try {
    // file is a Blob (see https://developer.mozilla.org/docs/Web/API/Blob)
    //const file = await getFile(
    //  fileURL,               // File in Pod to Read
    // fetch from authenticated session
    //);

    //console.log( `Fetched a ${getContentType(file)} file from ${getSourceUrl(file)}.`);
    //console.log(`The file is ${isRawData(file) ? "not " : ""}a dataset.`);
    //console.log(file)
    //var reader = new FileReader();
    //reader.addEventListener("loadend", function() {
    // reader.result beinhaltet den Inhalt des Blobs
    //});
    //reader.readAsArrayBuffer(file);
    //var test = reader.result;

    console.log("test2");
    const myDataset = await getSolidDataset(
      turtledatei, {
      fetch: fetch
    });
    const profile = getThing(
      myDataset,
      "<>"
    );
    console.log("test")
    console.log(getStringNoLocale(profile, "<http://creativecommons.org/ns#attributionName>"));
    //const fn = getStringNoLocale(file, "http://creativecommons.org/ns#attributionName");
    //console.log(fn)

  } catch (err) {
    console.log(err);
  }
}
async function newtest() {
  // 1. Call the handleIncomingRedirect() function,
  //    - Which completes the login flow if redirected back to this page as part of login; or
  //    - Which is a No-op if not part of login.
  await handleIncomingRedirect();

  // 2. Start the Login Process if not already logged in.
  if (!getDefaultSession().info.isLoggedIn) {
    await login({
      oidcIssuer: "https://solidcommunity.net/",
      redirectUrl: window.location.href,
      clientName: "My application"
    });
  }

  // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
  // For example, the user must be someone with Read access to the specified URL.
  const myDataset = await getSolidDataset(
    turtledatei, {
    fetch: fetch
  });
  const profile = getThing(
    myDataset,
    turtledatei
  );
  //console.log(profile.predicates["https://alexh156.solidcommunity.net/Splitspense/nils"].literals["http://www.w3.org/2001/XMLSchema#integer"][0]);
  const fn = getInteger(profile, "https://alexh156.solidcommunity.net/Splitspense/nils");
  //const acquaintances = getUrlAll(profile, FOAF.knows);
  console.log(fn);
}

async function newtest2(name) {
  var machprint = false;
  if (name == null) {
    name = document.getElementById("webID").value;
    machprint = true;
  }
  const myDataset = await getSolidDataset(
    turtledatei, {
    fetch: fetch
  });
  const profile = getThing(
    myDataset,
    turtledatei
  );
  const fn = getInteger(profile, "https://alexh156.solidcommunity.net/Splitspense/" + name);
  if (machprint) {
    document.getElementById("labelFN").textContent = fn;
  }
  return fn;
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
  newtest2();
});