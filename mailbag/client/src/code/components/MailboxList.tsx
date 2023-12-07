//import react
import React from "react";

//import Material-UI
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";

const MailboxList=({state}:{state:any}):JSX.Element=>(
    <List>
        {state.mailboxes.map((value:any) => {
            return (
            <Chip label={ `${value.name}` } onClick={ () =>state.setCurrentMailbox(value.path)}
            style={{ width:128, marginBottom:10 }}
            color={ state.currentMailbox === value.path ?"secondary" : "primary" } />
        );
 } ) }
    </List>
);

export default MailboxList;