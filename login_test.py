import login

while(True):
    print "Do you want to (l)ogin, (r)egister or (q)uit?"
    choice = raw_input()

    if choice == 'l':
        print "Enter username"
        username = raw_input()
        print "Enter password"
        password = raw_input()

        try:
            if login.login(username, password):
                print "Correct password"
            else:
                print "Incorrect password"
        except login.LoginException as e:
            print e

    elif choice == 'r':
        print "Enter username"
        username = raw_input()
        print "Enter password"
        password = raw_input()

        try:
            login.register(username, password)
        except login.LoginException as e:
            print e
        else:
            print "Registration succeeded"

    elif choice == 'q':
        break
