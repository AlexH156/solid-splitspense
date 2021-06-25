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
var fileLocation = {
  base: "",
  splitspense: "",
  members: "",
  history: "",
  name: "",
  information: "",
}


var turtledatei = "https://alexh156.solidcommunity.net/Splitspense/splitspense.ttl";


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
  if (session.info.isLoggedIn) {
    webID = session.info.webId.replace("https://", "").replace("http://", "").split(".")[0];
    document.getElementById(
      "labelStatus"
    //).innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
    ).innerHTML = "Welcome " + webID + " to Splitspense. Your are logged in.";
    document.getElementById("labelStatus").setAttribute("role", "alert");

    // document.getElementById("group_value").value = allmembers;
    // document.getElementById("input_members").value = allmembers;
    // document.getElementById("groupinformation").innerHTML = "Group description: " + groupinformation;
    // console.log("webid gepseichert");
  }
}
handleRedirectAfterLogin();


async function writeData() {
  if (session.info.isLoggedIn == false) {
    alert("You are not logged in. To continue please login.");
  }
  else {
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
    if (document.getElementById("input_members") == null){
      alert("No members could be found.");
    }
    else{
      const tt = document.getElementById("input_members").value;
      const members = tt.split(",");

      const membercount = members.length;
      //const admin = getStringNoLocale(profile, "https://alexh156.solidcommunity.net/Splitspense/admin");
      for (var i in members) {
        var newInt = 0.0;
        if (members[i] == webID) {
          newInt = -value / membercount * (membercount - 1) + await getBalance(members[i]);
          console.log("members; " + members);
        }
        else {
          newInt = value / membercount + await getBalance(members[i]);
        }
        //update history
        var today = new Date().toLocaleDateString();
        const oldhistory = getStringNoLocale(profile, fileLocation.history);
        const newhistory = webID.toString() + " paid " + document.getElementById("input_value").value + "€ for " + document.getElementById("input_comment").value + " on " + today + " for the members: " + document.getElementById("input_members").value + ";" + oldhistory;

        let updatedProfile = setDecimal(profile, fileLocation.base + "/" + members[i], newInt);
        //updatedProfile = addStringNoLocale(updatedProfile, FOAF.nick, "docs");
        //updatedProfile = addStringNoLocale(updatedProfile, FOAF.nick, "example");

        // 2. Update SolidDataset with the updated Thing (i.e., updatedProfile). 
        // Note:  solid-client functions do not modify objects passed in as arguments. 
        // Instead the functions return new objects with the modifications.
        // That is, setThing returns a new SolidDataset and
        // - myDataset remains unchanged.
        // - updatedProfile remains unchanged.

        const myChangedDataset = setThing(myDataset, updatedProfile);
        const savedProfileResource = await saveSolidDatasetAt(
          turtledatei,
          myChangedDataset,
          { fetch: fetch }
        );
      }
    }
    //update history
    var today = new Date().toLocaleDateString();
    const oldhistory = getStringNoLocale(profile, fileLocation.history);
    const newhistory = webID.toString() + " paid " + document.getElementById("input_value").value + "€ for " + document.getElementById("input_comment").value + " on " + today + ";" + oldhistory;

    let updatedProfile = setStringNoLocale(profile, fileLocation.history, newhistory);
    const myChangedDataset = setThing(myDataset, updatedProfile);
    const savedProfileResource = await saveSolidDatasetAt(
      turtledatei,
      myChangedDataset,
      { fetch: fetch }
    );
    getAllBalances();
  }

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
    const fn = getDecimal(profile, fileLocation.name);
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
    const mm = getStringNoLocale(profile, fileLocation.members);
    const members = mm.split(",");
    members.forEach(member => output += member.toString() + ": " + getDecimal(profile, fileLocation.base + member) + "\n");
    const hh = getStringNoLocale(profile, fileLocation.history);
    const history = hh.split(";");
    output += "\nHistory: \n"
    history.forEach(his => output += his.toString() + "\n");

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

    let updatedProfile = setStringNoLocale(profile, fileLocation.members, document.getElementById("group_value").value);
    const myChangedDataset = setThing(myDataset, updatedProfile);
    const savedProfileResource = await saveSolidDatasetAt(
      turtledatei,
      myChangedDataset,
      { fetch: fetch }
    );
    getAllBalances();
  }
}

async function folderSubmitfunc() {
  if (session.info.isLoggedIn == false) {
    alert("You are not logged in. To continue please login.");
  }
  else {

    fileLocation.base = document.getElementById("folderLink").value;
    fileLocation.splitspense = fileLocation.base + "/splitspense.ttl";
    fileLocation.members = fileLocation.base + "/members";
    fileLocation.name = fileLocation.base + "/name";
    fileLocation.history = fileLocation.base + "/history";
    fileLocation.information = fileLocation.base + "/information";

    turtledatei = fileLocation.base + "/splitspense.ttl"; //turtledatei muss immer gleich heißen

    console.log(fileLocation);

    const myDataset = await getSolidDataset(turtledatei, { fetch: fetch });
    const profile = getThing(myDataset, turtledatei);
    const allmembers = getStringNoLocale(profile, fileLocation.members);
    const groupinformation = getStringNoLocale(profile, fileLocation.information);

    document.getElementById("group_value").value = allmembers;
    document.getElementById("groupinformation").innerHTML = "Group description: " + groupinformation;
    console.log("webid gepseichert");
    getAllBalances();
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

folderSubmit.onclick = function () {
  folderSubmitfunc();
}

infoButton.onclick = function () {
  console.log(webID + ":WebID");
  console.log(session);
  logintest();
}