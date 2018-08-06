// User list data array for filling in info box
var userListData = []; 

// DOM ready 
$(document).ready(function() {

    // populate the user table on initial page load 
    populateTable(); 

    // username link click 
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo); 

    // add user button click 
    $('#btnAddUser').on('click', addUser); 

    // delete user link lick 
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser); 
}); 

Functions 

// Fill table with data 
function populateTable() {

    // Empty content string
    var tableContent = '';
  
    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
  
      // For each item in our JSON, add a table row and cells to the content string
      $.each(data, function(){
        userListData = data; 
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
        tableContent += '</tr>';
      });
  
      // Inject the whole content string into our existing HTML table
      $('#userList table tbody').html(tableContent);
    });
};

// Show User Info 
function showUserInfo(event) {

    // prevent link from firing 
    event.preventDefault(); 

    // retrieve username from link rel attribute 
    var thisUserName = $(this).attr('rel'); 

    // get index of object based on id value 
    var arrayPos = userListData.map(function(arrayItem) {
        return arrayItem.username; 
    }).indexOf(thisUserName); 

    // get user object
    var thisUserObject = userListData[arrayPos]; 

    // populate info box
    $('#userInfoName').text(thisUserObject.fullname); 
    $('#userInfoAge').text(thisUserObject.age); 
    $('#userInfoGender').text(thisUserObject.gender); 
    $('#userInfoLocation').text(thisUserObject.location); 

}

// Add User 
function addUser(event) {

    event.preventDefault(); 

    // basic validation - increase errorCount variable if any fields are blank
    var errCount = 0; 
    $('#addUser input').each(function(index, val) {
        if ($(this).val() === '') { errCount++; }
    }); 

    // check and make sure there are no errors
    if (errCount === 0) {

        // if it is, compile all user info into one object
        var newUser = {
            'username' : $('#addUser fieldset input#inputUserName').val(),
            'email' : $('#addUser fieldset input#inputUserEmail').val(),
            'fullname' : $('#addUser fieldset input#inputUserFullname').val(), 
            'age' : $('#addUser fieldset input#inputUserAge').val(), 
            'location' : $('#addUser fieldset input#inputUserLocation').val(), 
            'gender' : $('#addUser fieldset input#inputUserGender').val()
        }

        // use AJAX to post the object to our adduser service 
        $.ajax({ 
            type: 'POST', 
            data: newUser, 
            url: '/users/adduser', 
            dataType: 'JSON'
        }).done(function(response) {

            // check for successful (blank) response 
            if (response.msg === '') {

                // clear the form inputs 
                $('#addUser fieldset input').val(''); 

                // update the table 
                populateTable(); 
            } else {
                // if something goes wrong, alert the error message that our service returned 
                alert('Error: ' + response.msg); 
            }
        }); 
    } else {
        // if errCount is > 0, error out 
        alert('Please fill in all fields'); 
        return false; 
    }
}

// Delete User 
function deleteUser(event) {
    event.preventDefault(); 

    // pop up a confirmation dialog 
    var confirmation = confirm('Are you sure you want to delete user?'); 

    // check and make sure the user confirmed 
    if (confirmation === true) {
        // if they did, do our delete 
        $.ajax({
            type: 'DELETE', 
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(response) {

            // check for successful response 
            if (response.msg === '') {
            } else {
                alert('Error: ' + response.msg); 
            }

            // update the table 
            populateTable(); 
        }); 
    } else {
        // if they said no to the confirm, do nothing 
        return false; 
    }
}