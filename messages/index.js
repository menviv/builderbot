/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var moment = require('moment');
var DateFormat = "DD-MM-YYYY HH:mm:ss";
var LogTimeStame = moment().format(DateFormat); 

// Initialize mongo integration must

var mongo = require('mongodb');
var connString = 'mongodb://bot:bot@ds056979.mlab.com:56979/builderbot';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbm;
var collTrees;
var collPaths;
var collOpts;
var collUsers;

// Initialize connection once

mongo.MongoClient.connect(connString, function(err, database) {
  if(err) throw err;
 
  dbm = database;

  collTrees = dbm.collection('Trees');
  collPaths = dbm.collection('Paths');
  collOpts = dbm.collection('Opts');
  collUsers = dbm.collection('Users');

});

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

var UserEmail;
var UserName;
var UserGoal;
var UserID;
var PathID;
var nAnswersCounter = parseInt("1");


bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Welcome to BuilderBot... I'm here to help you build and configure my son Bot :), but first: What's your email?");


        var LogRecord = {
            'Time': 'New',
            'ExpirationTime':'New',
            'Status':'New'
        }    	
    	
    	collTrees.insert(LogRecord, function(err, result){});






    },
    function (session, results) {

        UserEmail = results.response;

        session.send("Thank you" + UserEmail);

        AllocateUserEmail();

        function AllocateUserEmail() {
                
                var cursor = collUsers.find({"UserEmail": UserEmail});
                var result = [];
                cursor.each(function(err, doc) {
                    if(err)
                        throw err;
                    if (doc === null) {
                        // doc is null when the last document has been processed

                        if (result.length < 1) {

                            NonRegisteredUser();

                        } else {

                            UserExistsByEmail();

                            UserName = result[0].UserName;
                            UserGoal = result[0].UserGoal;
                            UserID = result[0]._id;

                        }
                        
                        return;
                    }
                    // do something with each doc, like push Email into a results array
                    result.push(doc);
                });
            
        }


        function NonRegisteredUser() {

            var UserRecord = {
                'CreatedTime': LogTimeStame,
                'CreatedBy':'admin',
                'ObjectType':'UserRecord',
                'UserEmail':UserEmail,
                'ObjectFormat':'txt',
                'Status':'draft'
            }    	
            
            collUsers.insert(UserRecord, function(err, result){});

            builder.Prompts.text(session, "And you name?"); 

        }

        function UserExistsByEmail() {

            session.userData.email = results.response;
            session.userData.name = UserName;
            session.userData.goal = UserGoal;
            builder.Prompts.text(session, "Good to have you back with me! Are you ready to scale your bot?"); 

         }



    },    
    function (session, results) {

        UserName = results.response;
        session.userData.name = UserName;

        builder.Prompts.choice(session, "Bots are the obvious method to create valuble discussion with the new users, what do you want to scale??", ["discussion", "Conversion $", "Presense"]);
    },

    function (session, results) {

        UserGoal = results.response.entity;

        session.userData.goal = UserGoal;

        function RegisterNewUser() {

            var UserRecord = {
                'CreatedTime': LogTimeStame,
                'CreatedBy':'admin',
                'ObjectType':'UserRecord',
                'UserName':UserName,
                'UserEmail':UserEmail,
                'UserGoal':UserGoal,
                'ObjectFormat':'txt',
                'Status':'draft'
            }    	
            
            collUsers.insert(UserRecord, function(err, responseDoc){

                UserID = responseDoc._id;
                //session.send("Got it... " + result.length);

            });

            

            session.send("Thank you for sharing this information with me. Ready to start your first bot?"); 

           // session.send("Got it... " + session.userData.name + 
           // " your email address is: " + session.userData.email + 
           // " and your bot will help you increase  " + session.userData.goal + ".");
            session.beginDialog("/location", { location: "path" });

        }


        RegisterNewUser();

        

    }
]);


var paths = {

    "path": { 
        description: "Are you ready to create te first path?",
        commands: { "yes": "pathAddNew", "later": "pathAddOptLater"  }
    },

    "pathAddNew": { 
        description: "Let's create a call to action path for the end user to choose from:",
        commands: { "ok": "pathAddOpt", "later": "pathAddOptLater"  }
    },    

    "pathNew": { 
        description: "Path was created succesfully! Now let's attached options for the end user to select..",
        commands: { "ok": "pathAddOpt", "later": "pathAddOptLater"  }
    },

            "tzipi51": { 
                description: "אני מדברת המון בחוגי הבית על הנושאים העכשוויים וגם קצת על ישראל ביום שאחרי",
                commands: { "רוצה לשמוע עוד": "tzipi3000", "פחות מתחבר/ת": "tzipi2000"  }
            },  

            "tzipi52": { 
                description: "ציפי לבני על פינוי עמונה: מותר לבקר פסק דין אבל אסור להפוך את בית המשפט לאויב",
                commands: { "https://www.youtube.com/watch?v=kclPkykTGsY": "tzipi521", "רוצה לשמוע עוד": "tzipi3000", "פחות מתחבר/ת": "tzipi2000"  }
            },

            "tzipi53": { 
                description: "המסר האחרון שלי היה: ראש הממשלה יודע שחוק ההסדרה רע לישראל ומתפלל שבגצ יפסול אותו",
                commands: { "https://soundcloud.com/tzipi-livni/kdirjxyipjrx": "tzipi531", "רוצה לשמוע עוד": "tzipi3000", "פחות מתחבר/ת": "tzipi2000"  }
            },            
                          

    "tzipi10": { 
        description: "תראו, אני מתכננת לגעת בכמה נושאים מורכבים כשאבחר, מה הכי מדבר אליכם?",
        commands: { "ניהול תהליך מדיני כדי לשמור על אופייה של ישראל יהודית ודמוקרטית": "tzipi1103", "שקיפות בקרן קיימת לישראל": "tzipi1103", "הנהגת סוף השבוע הארוך": "tzipi1103", "לא מתחבר/ת": "tzipi1103", "הכל": "tzipi4000"  }
    },

     "tzipi1103": { 
        description: "האמת שאני מתלבטת, רוצים לעזור לי להתמקד בעוד משהו מהותי?",
        commands: { "כן": "tzipi11031", "פחות": "tzipi2000", "בא לי להצטרף למאבק שלך": "tzipi3000", "תודה ולהתראות": "tzipi1000" }
     },    

            "tzipi11031": { 
                description: "או קיי, אז אני מתכננת להוביל את הקמת גוף נציבות הביקורת על הפרקליטות?",
                commands: { "הגיע הזמן!": "tzipi110311", "זה לא יעבוד...": "tzipi2000", "בא לי להצטרף למאבק שלך": "tzipi3000", "תודה ולהתראות": "tzipi1000" }
            },

                    "tzipi110311": { 
                        description: "וואלה? מתוך חיבור אישי?",
                        commands: { "כן": "tzipi1103111", "לא": "tzipi4000", "הסיבות שלי שמורות איתי": "tzipi4000" }
                    },
            

    "tzipi20": { 
        description: "הגיע הזמן לבנות מחנה דמוקרטי רחב שיהווה אלטרנטיבה לשלטון הימין, נכון?",
        commands: { "מדויק": "tzipi201", "רוצים להצטרף למאבק עכשיו!": "tzipi3000" }
    },


            "tzipi201": { 
                description: "כל מי שישראל היהודית, הדמוקרטית, המתונה, שמשלבת בין פעולה ביטחונית למהלך מדיני, יקרה ללבו - חייב להתאחד עכשיו.",
                commands: { "לגמרי!": "tzipi4000", "המסר הזה קצת באוויר בשבילי": "tzipi10" }
            },
            

     "tzipi1000": {
        description: "מצפה לראותך תומך בקלפי",
        commands: { "אולי...": "tzipi4000", "פחות, בהצלחה ולהתראות": "tzipi1000" }
    },    

    "tzipi2000": {
        description: "אז יאללה, נתחיל מהתחלה?",
        commands: { "כן": "tzipi0", "מעדיפים פשוט לדבר עם מישהו": "tzipi3000", "פחות, בהצלחה ולהתראות": "tzipi1000" }
    },                         

    "tzipi3000": {
        description: "מעולה! אז אשמח אם תשאירו פרטים בטופס הבא:",
        commands: { "http://lp.vp4.me/rhrt": "tzipi3001", "תודה ולהתראות": "tzipi1000" }
    }, 

    "tzipi4000": {
        description: "בא לכם לשמוע קצת יותר על הפעילות שלי??",
        commands: { "בכייף": "tzipi3000", "תודה ולהתראות": "tzipi1000" }
    },     
  
}






bot.dialog('/location', [
    function (session, args) {
        var location = paths[args.location];
        session.dialogData.commands = location.commands;
        builder.Prompts.choice(session, location.description, location.commands);
    },
    function (session, results) {
        session.sendTyping();
        var destination = session.dialogData.commands[results.response.entity];

        if (destination != 'pathNew' || destination != 'pathDel') {

            session.replaceDialog("/location", { location: destination });

        } else if (destination == 'pathNew') {

            session.sendTyping();

            builder.send(session, "Let's start by creating PROMPTS based question. My advice is to ask short and simplae questions. Example: what is your name?"); 

            session.beginDialog("/pathNew_Prompts");

        } else if (destination == 'tzipi1000') {
            session.sendTyping();
            session.endDialog("תודה על הנכונות להקשיב, זה לא מובן מאליו");
            session.userData.profile = '';
            session.endConversation();
            session.beginDialog("/location", { location: "tzipi0" });

        } else if (destination == 'tzipi3000') {

            session.sendTyping();
            session.replaceDialog("/location", { location: "tzipi5"  });

        }
        
    }
]);


bot.dialog('/pathNew_Prompts', [
    function (session) {

            builder.Prompts.text(session, "Your first question will be: "); 

       // builder.Prompts.choice(session, "Which region would you like sales for?", salesData); 
    },
    function (session, results) {

        if (results.response) {

            var PathRecord = {
                'CreatedTime': LogTimeStame,
                'UserID': UserID,
                'CreatedBy':UserName,
                'CreatedByEmail':UserEmail,
                'ObjectType':'CloseQuestions',
                'ObjectFormat':'txt',
                'ObjectTxt':results.response,
                'Status':'draft'
            }    	
            
            collPaths.insert(PathRecord, function(err, result){

                PathID = result._id;

            });

            session.beginDialog("/pathNew_Prompts_Answers");

            //var region = salesData[results.response.entity];
            session.send("Now, let's define the optional answer choices. We advice to refrain from exceeding tje 3-4 possibilities..."); 
        } else {
            session.send("ok");
        }
    }
]);





bot.dialog('/pathNew_Prompts_Answers', [
    function (session) {

            

            builder.Prompts.text(session, "Your " + nAnswersCounter + "choice for answer will be: "); 

       // builder.Prompts.choice(session, "Which region would you like sales for?", salesData); 
    },
    function (session, results) {

        if (results.response) {

            var OptRecord = {
                'CreatedTime': LogTimeStame,
                'PathID': PathID,
                'UserID': UserID,
                'CreatedBy':UserName,
                'CreatedByEmail':UserEmail,
                'ObjectType':'CloseQuestions',
                'ObjectFormat':'txt',
                'ObjectTxt':results.response,
                'Status':'draft'
            }    	
            
            collOpts.insert(OptRecord, function(err, result){

                OptID = result._id;

                nAnswersCounter = nAnswersCounter + 1;

            });

            session.beginDialog("/pathNew_Prompts_Answers_verify_Next_choice");

            //var region = salesData[results.response.entity];
            session.send("Now, let's define the optional answer choices. We advice to refrain from exceeding tje 3-4 possibilities..."); 
        } else {
            session.send("ok");
        }
    }
]);



if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
