const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  // You'll need to implement proper admin checking
  // For now, we'll just check if a header is present
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// Get all pending creator applications
router.get('/creator-applications', isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('creator_applications')
      .select(`
        *,
        user:profiles!user_id(*)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ applications: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject creator application
router.patch('/creator-applications/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes, reviewedBy } = req.body;
    
    // Update application
    const { data: application, error: appError } = await supabase
      .from('creator_applications')
      .update({
        status,
        review_notes: reviewNotes,
        reviewed_by: reviewedBy,
        reviewed_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (appError) {
      return res.status(400).json({ error: appError.message });
    }
    
    // If approved, update user profile
    if (status === 'approved') {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_creator: true,
          is_approved: true,
          approval_status: 'approved',
          badge_level: 'blue'
        })
        .eq('id', application.user_id);
      
      if (profileError) {
        return res.status(400).json({ error: profileError.message });
      }
    }
    
    res.status(200).json({ 
      message: `Application ${status}`,
      application 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all pending assets
router.get('/assets/pending', isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        creator:profiles!creator_id(*)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ assets: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject asset
router.patch('/assets/:id/review', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
    const updateData = {
      status,
      updated_at: new Date()
    };
    
    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }
    
    const { data: asset, error } = await supabase
      .from('assets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ 
      message: `Asset ${status}`,
      asset 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platform statistics
router.get('/stats', isAdmin, async (req, res) => {
  try {
    // Get user stats
    const { data: userStats, error: userError } = await supabase
      .from('profiles')
      .select('is_creator, is_approved, badge_level')
      .then(result => {
        if (result.error) return { data: null, error: result.error };
        
        const stats = {
          totalUsers: result.data.length,
          creators: result.data.filter(u => u.is_creator).length,
          approvedCreators: result.data.filter(u => u.is_approved).length,
          badges: {
            blue: result.data.filter(u => u.badge_level === 'blue').length,
            silver: result.data.filter(u => u.badge_level === 'silver').length,
            gold: result.data.filter(u => u.badge_level === 'gold').length,
          }
        };
        return { data: stats, error: null };
      });
    
    if (userError) {
      return res.status(400).json({ error: userError.message });
    }
    
    // Get asset stats
    const { data: assetStats, error: assetError } = await supabase
      .from('assets')
      .select('status, download_count, platform')
      .then(result => {
        if (result.error) return { data: null, error: result.error };
        
        const stats = {
          totalAssets: result.data.length,
          approved: result.data.filter(a => a.status === 'approved').length,
          pending: result.data.filter(a => a.status === 'pending').length,
          rejected: result.data.filter(a => a.status === 'rejected').length,
          totalDownloads: result.data.reduce((sum, a) => sum + a.download_count, 0)
        };
        return { data: stats, error: null };
      });
    
    if (assetError) {
      return res.status(400).json({ error: assetError.message });
    }
    
    res.status(200).json({ 
      users: userStats,
      assets: assetStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manually update user badges
router.patch('/users/:id/badge', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { badgeLevel } = req.body;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        badge_level: badgeLevel,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ 
      message: 'Badge updated successfully',
      user: data
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
