import { useState } from "react";

function RegisterTicket({ modal, setModal, appoint }) {
   return (
      <div  className={`modal_background ${modal ? 'active' : ''}`} onClick={() => setModal(false)}>
         <div className="modal_container" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
               <span className="icon cross_icon" onClick={() => setModal(false)} />
            </div>
         </div>
      </div>
   )
}

export default RegisterTicket;