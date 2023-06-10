# crud-app
Basic crud operation using node.js and postgreSQL.

# Project Setup

1. Clone the project on your local.
2. Execute "npm install" on the same path as of your root directory of the downloaded project.
3. Create a .env file in the root directory and add the following environmental variables.

    {
        PORT = 8000
        OTP_MAIL = "your_email"           // This email will be used to send email to the user at the time of registration
        OTP_PASSWORD = "your_password"    // email password
        JWTKEY = "any_key"                // You can set anything as your JWTKEY
        PASSWORD = "password"             // Postgres database password
    }
    
4. Then open the postgress database and create a database.
5. Then set your db_name in db.js file in the "library" directory in the project.
6. Then create all the necessary tables and add table data given in the "DB data.txt" file.
7. Once you've done with all this steps, go to the index.js file and run the command "npm start" to run the server.



# OTP_PASSWORD_CONFIGURATION   // Googel won't allow you to use your original password, for that you have to create new password 

TO GENERATE NEW PASSWORD FOR THE EMAIL YOU USED ABOVE, FOLLOW THESE STEPS

1. Go to "manage your gooogle account"
2. Go to "security"
3. Turn on 2 step verification
4. Then go to 2 step verification tab
5. Then go to "App Password" at the bottom of the page and click on it
6. There you will see two dropdowns
7. Select "MAIL" from the "select app" dropdown menu
8. Select "Others(custom name)" from the "Select device" dropdown menu
9. Enter any name and click on generate
10. There you will see your generated password of 16 characters, Copy that password and add as the value of "OTP_PASSWORD" in the .env file
