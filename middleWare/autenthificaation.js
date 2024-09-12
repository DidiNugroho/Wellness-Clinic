const isLoggedIn = function(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    
    // Jika user belum login, simpan URL yang diminta
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
};

const pasien = function(req, res, next) {
    if (req.session && req.session.userId && req.session.userRole === 'Pasien') {
        return next();
    }
    
    if (!req.session.userId) {
        // Jika user belum login, simpan URL yang diminta
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    
    return res.status(403).send("Unauthorized: Akses hanya untuk Pasien");
};

const dokter = function(req, res, next) {
    if (req.session && req.session.userId && req.session.userRole === 'Dokter') {
        return next();
    }
    
    if (!req.session.userId) {
        // Jika user belum login, simpan URL yang diminta
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    
    return res.status(403).send("Unauthorized: Akses hanya untuk Dokter");
};

module.exports = { isLoggedIn, pasien, dokter };