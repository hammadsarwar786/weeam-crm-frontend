import LeadsSummary from "./LeadsSummary";

const UserViewLeads = ({usersList, dateTime}) =>{
    return <div style={{marginTop: 20}}>
         {usersList?.map((user) => {
        return (
          <div>
            <p>{user?.firstName + " " + user?.lastName}</p>
            <LeadsSummary dateTime={dateTime} user={user}/>
          </div>
        );
      })}
    </div>
}

export default UserViewLeads; 