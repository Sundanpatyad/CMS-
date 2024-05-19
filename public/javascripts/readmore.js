function expandText() {
    var postText = document.getElementById('postText');
    var caption = document.querySelector('small').innerText.trim();
    var words = caption.split(' ');
    
    if (words.length > 5) {
      if (postText.style.display === 'none' || postText.style.display === '') {
        postText.style.display = 'inline';
        document.getElementById('readMore').innerHTML = '...<a href="#" onclick="expandText()">Read less</a>';
      } else {
        postText.style.display = 'none';
        document.getElementById('readMore').innerHTML = '...<a href="#" onclick="expandText()">Read more</a>';
      }
    }
  }