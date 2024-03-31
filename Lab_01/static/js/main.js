function closePanel() {
    panel = document.getElementById('controlPanel-bg');
    ticket = document.getElementById('lateral-CP');
    
    panel.style.display = 'none';
    ticket.style.display = 'block';
}

function closeTicket() {
    panel = document.getElementById('controlPanel-bg');
    ticket = document.getElementById('lateral-CP');
    
    panel.style.display = 'block';
    ticket.style.display = 'none';
}

