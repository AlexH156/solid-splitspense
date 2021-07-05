import {
    getSolidDataset,
    getThing,
    setThing,
    getStringNoLocale,
    setStringNoLocale,
    saveSolidDatasetAt,
    getDecimal,
    setDecimal,
    addLiteral,

    //Possible functions which are unused
    /*
    getFile
    isRawData,
    getContentType,
    getSourceUrl,
    getInteger,
    setInteger,
    getThingAll,
    getPublicAccess,
    getAgentAccess */
} from "@inrupt/solid-client";
import {
    handleIncomingRedirect,
    login,
    fetch,
    getDefaultSession,
    Session
} from "@inrupt/solid-client-authn-browser";

//connect the buttons and forms
const buttonLogin = document.getElementById("btnLogin");
const writeForm = document.getElementById("writeForm");
const readForm = document.getElementById("readForm");
const groupForm = document.getElementById("groupForm");
const infoButton = document.getElementById("infoButton");
const nullEverything = document.getElementById("nullEverything");
const folderSubmit = document.getElementById("btnLinkSubmit");
const groupNameButton = document.getElementById("btnEdit");
const logoutButton = document.getElementById("logoutButton");

//define variables
var session;
var webID = "";
var fileLocation = {
    base: "",
    splitspense: "",
    members: "",
    history: "",
    name: "",
    information: "",
}
var turtledatei = "";

//login function, works with every pod-Provider
function loginToWebProvider(webIDProvider) {
    login({
        oidcIssuer: webIDProvider,
        redirectUrl: window.location.href,
        clientName: "Splitspense"
    });
    return
}

//function to handle redirect, and get WebID of the user. For https://nilskl.inrupt.net/profile/card#me it would be "nilskl"
//The WebID - Name is used for identification in the Splitspense File
async function handleRedirectAfterLogin() {
    await handleIncomingRedirect();

    session = getDefaultSession();
    if (session.info.isLoggedIn) {
        webID = session.info.webId.replace("https://", "").replace("http://", "").split(".")[0];
        document.getElementById(
            "labelStatus"
        ).innerHTML = "Welcome " + webID + " to Splitspense. You are logged in.";
        document.getElementById("labelStatus").setAttribute("role", "alert");
    }
}
handleRedirectAfterLogin();


async function writeData() {
    if (session.info.isLoggedIn == false) {
        alert("You are not logged in. To continue please login.");
    } else {
        const value = document.getElementById("input_value").valueAsNumber;
        // 1a. Start with an existing Thing (i.e., profile).
        // Note: Login code has been omitted for brevity. See the Prerequisite section above
        const myDataset = await getSolidDataset(turtledatei, { fetch: fetch });
        const profile = getThing(myDataset, turtledatei);

        // 1b. Modify the thing; 
        // Note: solid-client functions do not modify objects passed in as arguments. 
        // Instead the functions return new objects with the modifications.
        // That is, setStringNoLocale and addStringNoLocale return a new Thing and
        // - profile remains unchanged and 
        // - updatedProfile is changed only because it is explicitly set to the object returned from addStringNoLocale.
        if (document.getElementById("input_members") == null) {
            alert("No members could be found.");
        } else {
            const tt = document.getElementById("input_members").value.replaceAll(" ", "").toLowerCase();
            const members = tt.split(",");

            const membercount = members.length;
            for (var i in members) {
                var newInt = 0.0;
                if (members[i] == webID) {
                    newInt = -value / membercount * (membercount - 1) + await getBalance(members[i]);
                    console.log("writeData() -> members; " + members);
                } else {
                    newInt = value / membercount + await getBalance(members[i]);
                }

                let updatedProfile = setDecimal(profile, fileLocation.base + "/" + members[i], newInt);

                // 2. Update SolidDataset with the updated Thing (i.e., updatedProfile). 
                // Note:  solid-client functions do not modify objects passed in as arguments. 
                // Instead the functions return new objects with the modifications.
                // That is, setThing returns a new SolidDataset and
                // - myDataset remains unchanged.
                // - updatedProfile remains unchanged.
                const myChangedDataset = setThing(myDataset, updatedProfile);
                const savedProfileResource = await saveSolidDatasetAt(
                    turtledatei,
                    myChangedDataset, { fetch: fetch }
                );
            }
        }
        //update history
        var today = new Date().toLocaleDateString();
        const oldhistory = getStringNoLocale(profile, fileLocation.history);
        const newhistory = webID.toString() + " paid " + document.getElementById("input_value").value + "€ for " + document.getElementById("input_comment").value + " on " + today + " for the members: " + document.getElementById("input_members").value + ";" + oldhistory;

        let updatedProfile = setStringNoLocale(profile, fileLocation.history, newhistory);
        const myChangedDataset = setThing(myDataset, updatedProfile);
        const savedProfileResource = await saveSolidDatasetAt(
            turtledatei,
            myChangedDataset, { fetch: fetch }
        );
        getAllBalances();
    }

}


// return the balance of given name
async function getBalance(name) {
    if (session.info.isLoggedIn == false) {
        alert("You are not logged in. To continue please login.");
    } else {
        const myDataset = await getSolidDataset(
            turtledatei, {
                fetch: fetch
            });
        const profile = getThing(
            myDataset,
            turtledatei
        );
        const fn = getDecimal(profile, fileLocation.base + "/" + name);
        return fn;
    }
}

// print all balances and the history in the textbox
async function getAllBalances() {
    if (session.info.isLoggedIn == false) {
        alert("You are not logged in. To continue please login.");
    } else {
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
        members.forEach(member => output += member.toString() + ": " + (Math.round(getDecimal(profile, fileLocation.base + "/" + member) * 100) / 100).toFixed(2) + "\n");
        const hh = getStringNoLocale(profile, fileLocation.history);
        const history = hh.split(";");
        output += "\nHistory: \n"
        history.forEach(his => output += his.toString() + "\n");

        document.getElementById("labelFN").textContent = output;
    }
}


// update the members 
async function updateGroup() {
    //Check if the user is Logged in
    if (session.info.isLoggedIn == false) {
        alert("You are not logged in. To continue please login.");
    } else {
        const myDataset = await getSolidDataset(
            turtledatei, {
                fetch: fetch
            });
        const profile = getThing(
            myDataset,
            turtledatei
        );

        let updatedProfile = setStringNoLocale(profile, fileLocation.members, document.getElementById("group_value").value.replaceAll(" ", "").toLowerCase());
        const myChangedDataset = setThing(myDataset, updatedProfile);
        const savedProfileResource = await saveSolidDatasetAt(
            turtledatei,
            myChangedDataset, { fetch: fetch }
        );
        getAllBalances();
    }
}


// Set the folder for this session and update all values
async function folderSubmitfunc() {
    //Check if the user is Logged in
    if (session.info.isLoggedIn == false) {
        alert("You are not logged in. To continue please login.");
    } else {
        if (document.getElementById("folderLink").value == "https://") {
            alert("Please insert your Folder Link. For help check 'Getting Startet'.");
        } else {
            fileLocation.base = document.getElementById("folderLink").value;

            if (fileLocation.base.slice(-1) == "/") {} else { fileLocation.base += "/"; }

            fileLocation.splitspense = fileLocation.base + "/splitspense.ttl";
            fileLocation.members = fileLocation.base + "/members";
            fileLocation.name = fileLocation.base + "/name";
            fileLocation.history = fileLocation.base + "/history";
            fileLocation.information = fileLocation.base + "/information";

            turtledatei = fileLocation.base + "/splitspense.ttl"; //turtledatei muss immer gleich heißen

            console.log("folderSubmitfunc() -> fileLocation: " + fileLocation);

            const myDataset = await getSolidDataset(turtledatei, { fetch: fetch });
            const profile = getThing(myDataset, turtledatei);
            const allmembers = getStringNoLocale(profile, fileLocation.members);
            var groupinformation = getStringNoLocale(profile, fileLocation.information);

            document.getElementById("input_members").value = allmembers;
            document.getElementById("group_value").value = allmembers;
            document.getElementById("groupinformation").value = groupinformation;

            console.log("WebID gepseichert ");
            getAllBalances();
        }
    }
}

//Changing the Group description
async function editGroupName() {

    //Check if the user is Logged in
    if (session.info.isLoggedIn == false) {
        alert("You are not logged in. To continue please login.");
    } else {
        //Check if the Folder Link is provided 
        if (document.getElementById("folderLink").value == "https://") {
            alert("Please insert your Folder Link. For help check 'Getting Startet'.");
        } else {

            //get the new value of the input field "groupinformation" form the html file
            const newgroupinformation = document.getElementById("groupinformation").value;

            //recieve the solid Dataset and save the
            const myDataset = await getSolidDataset(turtledatei, { fetch: fetch });
            const profile = getThing(myDataset, turtledatei);
            let updatedProfile = setStringNoLocale(profile, fileLocation.information, newgroupinformation);
            const myChangedDataset = setThing(myDataset, updatedProfile);
            const savedProfileResource = await saveSolidDatasetAt(
                turtledatei,
                myChangedDataset, { fetch: fetch });

            document.getElementById("labelStatusgroup").innerHTML = "New Group description saved!";
            document.getElementById("labelStatusgroup").setAttribute("role", "alert");
        }
    }
}
//Reset all data in the File to start over again. 
nullEverything.onclick = async function() {
    if (session.info.isLoggedIn == false) {
        alert("You are not logged in. To continue please login.");
    } else {
        if (confirm('Are you sure you want to reset all data?')) {
            //reset members
            const myDataset = await getSolidDataset(turtledatei, { fetch: fetch });
            const profile = getThing(myDataset, turtledatei);;

            const allmembers = getStringNoLocale(profile, fileLocation.members);
            const members = allmembers.split(",");

            for (var i in members) {
                let updatedProfile = setDecimal(profile, fileLocation.base + "/" + members[i], 0.0);
                const myChangedDataset = setThing(myDataset, updatedProfile);
                const savedProfileResource = await saveSolidDatasetAt(
                    turtledatei,
                    myChangedDataset, { fetch: fetch }
                );
            }
            //reset history
            let updatedProfile = setStringNoLocale(profile, fileLocation.history, "");
            const myChangedDataset = setThing(myDataset, updatedProfile);
            const savedProfileResource = await saveSolidDatasetAt(
                turtledatei,
                myChangedDataset, { fetch: fetch }
            );
            getAllBalances();
        } else {}
    }
}

//Connection between HTML Buttons and JS
//Button: Get Balance 
readForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Get Balances: Button is functioning")
    getAllBalances();
});

//Button: Insert expesne 
writeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Insert expense: Button is functioning")
    writeData();
});

//Button: Update Group 
groupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Update Group: Button is functioning")
    updateGroup();
});

//Button: Login
buttonLogin.onclick = function() {
    console.log("Login: Button is functioning")
    const webIDProvider = document.getElementById("dropdownID").value;
    loginToWebProvider(webIDProvider);
};

//Button: Submit 
folderSubmit.onclick = function() {
        console.log("Submit: Button is functioning")
        folderSubmitfunc();
    }
    //Button: Save
groupNameButton.onclick = async function() {
    console.log("Save: Button is functioning")
    editGroupName();
}

//Button: Console Log Info
infoButton.onclick = async function() {
    console.log(webID + ":WebID");
    //console.log(session);

    // createEmptyDocument(fileLocation.base);
    //getPublicAccessfunc();
    console.log("Button is functioning")

}

logoutButton.onclick = function() {
    location.reload();
    alert("You are logged out!")
}