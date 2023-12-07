//import react
import React from "react";

// import material-ui
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Person from "@material-ui/icons/Person";
import ListItemText from "@material-ui/core/ListItemText";


const ContactList = ({ state }:{state:any}):JSX.Element=> (

  <List>
    {state.contacts.map((value: any) => {
      return (
        <ListItem key={ value } button onClick={ () => state.showContact(value._id, value.name, value.email) }>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={ `${value.name}` } secondary={ `${value.email}` } />
        </ListItem>
      );
    })}

  </List>

); /* End Contacts. */


export default ContactList;