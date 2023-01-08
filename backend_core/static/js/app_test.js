class FormDetails
    {
        constructor()
        {
            this.bagCount=0,
            this.organizationId=null,
            this.organizationName=null,
            this.userStreet=null,
            this.userCity=null,
            this.userPostCode=null,
            this.userPhone=null,
            this.userDate=null,
            this.userTime=null,
            this.userPickUpComment=null
        }

        setBagCount(e)
        {
            this.bagCount=e
        }

        setOrganization(e,t)
        {
            this.organizationId=e,
            this.organizationName=t
        }

        setUserDetails(e,t,n,i,o,r,s)
        {
            this.userStreet=e,this.userCity=t,this.userPostCode=n,this.userPhone=i,this.userDate=o,this.userTime=r,this.userPickUpComment=s}resetForm(e){"bagCount"===e?this.bagCount=0:"organization"===e?this.organization=null:"userDetails"===e&&(this.userStreet=null,this.userCity=null,this.userPostCode=null,this.userPhone=null,this.userDate=null,this.userTime=null,this.userPickUpComment=null)}}


let donationFormDetails=new FormDetails;

function summaryDetails()
{
    let e=document.querySelector("#bags"),t=document.querySelector("#organization"),n=document.querySelector("#address"),i=document.querySelector("#city"),o=document.querySelector("#post-code"),r=document.querySelector("#phone"),s=document.querySelector("#date"),a=document.querySelector("#hour"),l=document.querySelector("#more_info");e.innerText=`${donationFormDetails.bagCount} worki!`,t.innerText=`Dla fundacji: "${donationFormDetails.organizationName}"!`,n.innerText=donationFormDetails.userStreet,i.innerText=donationFormDetails.userCity,o.innerText=donationFormDetails.userPostCode,r.innerText=donationFormDetails.userPhone,s.innerText=donationFormDetails.userDate,a.innerText=donationFormDetails.userTime,l.innerText=donationFormDetails.userPickUpComment}function getCookie(e){let t=null;if(document.cookie&&""!==document.cookie){let n=document.cookie.split(";");for(let i=0;i<n.length;i++){let o=n[i].trim();if(o.substring(0,e.length+1)===e+"="){t=decodeURIComponent(o.substring(e.length+1));break}}}return t}(btnStageTwo=document.querySelector(".btn.next-step.stage-2")).addEventListener("click",function(e){e.preventDefault();let t=document.querySelector('[name="bags"]').value;donationFormDetails.setBagCount(t)}),(btnStageFour=document.querySelector(".btn.next-step.stage-4")).addEventListener("click",function(e){e.preventDefault();document.querySelectorAll(".institution").forEach(e=>{let t=e.querySelector('[type="radio"]');t.checked&&donationFormDetails.setOrganization(t.getAttribute("data-institution-id"),t.getAttribute("data-institution-name"))})}),(btnStageFive=document.querySelector(".btn.next-step.stage-5")).addEventListener("click",function(e){e.preventDefault();let t=document.querySelector('[name="address"]').value,n=document.querySelector('[name="city"]').value,i=document.querySelector('[name="postcode"]').value,o=document.querySelector('[name="phone"]').value,r=document.querySelector('[name="data"]').value,s=document.querySelector('[name="time"]').value,a=document.querySelector('[name="more_info"]').value;donationFormDetails.setUserDetails(t,n,i,o,r,s,a),summaryDetails()}),(btnStageSix=document.querySelector(".btn.stage-6")).addEventListener("click",function(e){e.preventDefault(),fetch("https://unused-items.maciejwasilewski.pl/donation/",{method:"POST",headers:{"X-CSRFToken":getCookie("csrftoken")},body:JSON.stringify(donationFormDetails)}).then(e=>{200===e.status&&window.location.replace("/donation/confirmation/")})});