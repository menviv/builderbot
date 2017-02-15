/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

// Initialize mongo integration must

var mongo = require('mongodb');
var connString = 'mongodb://bot:bot@ds056979.mlab.com:56979/builderbot';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbm;
var collTrees;

// Initialize connection once

mongo.MongoClient.connect(connString, function(err, database) {
  if(err) throw err;
 
  dbm = database;

  collTrees = dbm.collection('Trees');

});

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");


        var LogRecord = {
            'Time': 'New',
            'ExpirationTime':'New',
            'Status':'New'
        }    	
    	
    	collTrees.insert(LogRecord, function(err, result){});






    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", And...How many years have you been coding?"); 
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you've been programming for " + session.userData.coding + 
                    " years and use " + session.userData.language + ".");
        session.beginDialog("/location", { location: "Path" });
    }
]);


var paths = {

    "path": { 
        description: "אני מניחה שפנית אלי כי היית רוצה להיות חלק בשינוי שאני מתכננת להוביל בישראל, נכון?",
        commands: { "ממש!": "tzipi5", "גם זה, אבל כדי להביע תמיכה..": "tzipi20", "האמת שפחות": "tzipi2000"  }
    },

    "tzipi5": { 
        description: "מחזק ומעודד לדעת! אז מה יכול לעניינן אותך?",
        commands: { "יש לך רשימת נושאים מובילה?": "tzipi10", "לשמוע על חוגי בית": "tzipi51", "הנאום האחרון שלי בכנסת?": "tzipi52" , "ראיונות בתקשורת?": "tzipi53"  }
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

        if (destination != 'tzipi1000' || destination != 'tzipi2000' || destination != 'tzipi3000' || destination != 'tzipi4000') {

            session.replaceDialog("/location", { location: destination });

        } else if (destination == 'tzipi2000') {
            session.sendTyping();
            session.replaceDialog("/location", { location: "tzipi0"  });

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
