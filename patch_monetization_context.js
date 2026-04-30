const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/contexts/MonetizationContext.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the old checkFeatureLimit with the new one calling the RPC
const oldCheckFeatureLimit = `  const checkFeatureLimit = async (featureName, dailyLimit) => {
      if (!user) return { allowed: false, count: 0 };
      if (tier.name === 'VIP' || tier.name === 'Subscription') return { allowed: true, count: 0 }; // Unlimited for VIP/Sub

      try {
           // We increment right away to test if we passed limit.
           // If we just check, there's a race condition.
           // However, if we increment and we were over limit, we still incremented.
           // Let's create a better RPC for check_and_increment or handle here.

           // For now, let's fetch current usage
           const today = new Date().toISOString().split('T')[0];
           let { data, error } = await supabase
              .from('user_feature_usage')
              .select('usage_count')
              .eq('user_id', user.id)
              .eq('feature_name', featureName)
              .eq('usage_date', today)
              .maybeSingle();

           if(error) console.error(error);
           let count = data ? data.usage_count : 0;

           if (count >= dailyLimit) {
               return { allowed: false, count };
           }

           // Increment
           const { data: newCount, error: incError } = await supabase.rpc('increment_feature_usage', {
               p_user_id: user.id,
               p_feature_name: featureName
           });

           if (!incError) {
               return { allowed: true, count: newCount };
           }
           return { allowed: false, count };

      } catch (err) {
          console.error("Limit check error:", err);
          return { allowed: false, count: 0 };
      }
  };`;

const newCheckFeatureLimit = `  const checkFeatureLimit = async (featureName, limit, windowDays = 1) => {
      if (!user) return { allowed: false };
      if (tier.name === 'VIP' || tier.name === 'Subscription') return { allowed: true }; // Unlimited for VIP/Sub

      try {
           const { data: allowed, error } = await supabase.rpc('check_and_increment_usage', {
               p_user_id: user.id,
               p_feature_name: featureName,
               p_limit: limit,
               p_window_days: windowDays
           });

           if (error) throw error;
           return { allowed };

      } catch (err) {
          console.error("Limit check error:", err);
          return { allowed: false };
      }
  };`;

if (content.includes(oldCheckFeatureLimit)) {
    content = content.replace(oldCheckFeatureLimit, newCheckFeatureLimit);
} else {
    // If exact match fails, use regex or replace the function body
    console.log("Warning: Exact match for checkFeatureLimit failed. Attempting targeted replace.");
    content = content.replace(/const checkFeatureLimit = async \([\s\S]*?catch \(err\) {[\s\S]*?return { allowed: false, count: 0 };\n      }\n  };/, newCheckFeatureLimit);
}

fs.writeFileSync(filePath, content);
console.log('MonetizationContext updated with windowed feature limits.');
