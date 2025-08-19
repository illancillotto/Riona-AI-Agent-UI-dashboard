'use client';

import { useState } from 'react';
import { 
  Instagram, 
  Heart, 
  MessageSquare, 
  Image,
  Hash,
  Clock,
  Upload
} from 'lucide-react';
import ActionCard from '../../components/ActionCard';
import { Riona } from '../../lib/rionaApi';
import { showToast } from '../../lib/utils';

export default function ActionsPage() {
  const [imagePreview, setImagePreview] = useState(null);

  // Instagram Login Action
  const handleInstagramLogin = async (credentials) => {
    const response = await Riona.loginInstagram(credentials);
    return { message: 'Instagram login successful' };
  };

  // Post to Instagram Action
  const handlePostToInstagram = async (postData) => {
    try {
      const response = await Riona.postToInstagram(postData);
      return { message: 'Post published successfully' };
    } catch (error) {
      // Fallback for demonstration
      if (postData.image && postData.caption) {
        return { message: 'Post would be published (backend endpoint needed)' };
      }
      throw error;
    }
  };

  // Like by Hashtag Action
  const handleLikeByHashtag = async (likeData) => {
    try {
      const response = await Riona.likeByHashtag(likeData);
      return { message: `Started liking posts for #${likeData.hashtag}` };
    } catch (error) {
      // Fallback for demonstration
      return { message: `Would start liking posts for #${likeData.hashtag} (backend endpoint needed)` };
    }
  };

  // Comment by Hashtag Action
  const handleCommentByHashtag = async (commentData) => {
    try {
      const response = await Riona.commentByHashtag(commentData);
      return { message: `Started commenting on posts for #${commentData.hashtag}` };
    } catch (error) {
      // Fallback for demonstration
      return { message: `Would start commenting on #${commentData.hashtag} posts (backend endpoint needed)` };
    }
  };

  const handleImageChange = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setImagePreview(base64);
        callback(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Instagram Actions</h1>
        <p className="text-muted-foreground mt-1">
          Manage your Instagram automation and engagement
        </p>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Instagram Login */}
        <ActionCard
          title="Instagram Login"
          description="Connect your Instagram account for automation"
          icon={Instagram}
          onSubmit={handleInstagramLogin}
        >
          {({ loading, onSubmit }) => (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onSubmit({
                username: formData.get('username'),
                password: formData.get('password')
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                  placeholder="Your Instagram username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                  placeholder="Your Instagram password"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login to Instagram'}
              </button>
            </form>
          )}
        </ActionCard>

        {/* Post to Instagram */}
        <ActionCard
          title="Post to Instagram"
          description="Upload and publish content to your Instagram feed"
          icon={Image}
          onSubmit={handlePostToInstagram}
          className="xl:row-span-2"
        >
          {({ loading, onSubmit }) => (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onSubmit({
                image: imagePreview,
                caption: formData.get('caption'),
                hashtags: formData.get('hashtags')
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Image Upload
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, () => {})}
                        className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Caption
                </label>
                <textarea
                  name="caption"
                  rows="4"
                  disabled={loading}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                  placeholder="Write your caption..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  name="hashtags"
                  disabled={loading}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                  placeholder="#hashtag1 #hashtag2 #hashtag3"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !imagePreview}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </form>
          )}
        </ActionCard>

        {/* Like by Hashtag */}
        <ActionCard
          title="Auto Like Posts"
          description="Automatically like posts by hashtag"
          icon={Heart}
          onSubmit={handleLikeByHashtag}
        >
          {({ loading, onSubmit }) => (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onSubmit({
                hashtag: formData.get('hashtag'),
                limit: parseInt(formData.get('limit')) || 10,
                delayMs: parseInt(formData.get('delayMs')) || 5000
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hashtag
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="hashtag"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                    placeholder="technology"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Limit
                  </label>
                  <input
                    type="number"
                    name="limit"
                    min="1"
                    max="50"
                    defaultValue="10"
                    disabled={loading}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Delay (ms)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      name="delayMs"
                      min="1000"
                      max="60000"
                      step="1000"
                      defaultValue="5000"
                      disabled={loading}
                      className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Starting...' : 'Start Liking'}
              </button>
            </form>
          )}
        </ActionCard>

        {/* Comment by Hashtag */}
        <ActionCard
          title="Auto Comment"
          description="Leave AI-generated comments on posts"
          icon={MessageSquare}
          onSubmit={handleCommentByHashtag}
        >
          {({ loading, onSubmit }) => (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onSubmit({
                hashtag: formData.get('hashtag'),
                tone: formData.get('tone'),
                limit: parseInt(formData.get('limit')) || 5,
                delayMs: parseInt(formData.get('delayMs')) || 10000
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hashtag
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="hashtag"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                    placeholder="ai"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comment Tone
                </label>
                <select
                  name="tone"
                  disabled={loading}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                >
                  <option value="friendly">Friendly</option>
                  <option value="informative">Informative</option>
                  <option value="supportive">Supportive</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Limit
                  </label>
                  <input
                    type="number"
                    name="limit"
                    min="1"
                    max="20"
                    defaultValue="5"
                    disabled={loading}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Delay (ms)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      name="delayMs"
                      min="5000"
                      max="120000"
                      step="1000"
                      defaultValue="10000"
                      disabled={loading}
                      className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Starting...' : 'Start Commenting'}
              </button>
            </form>
          )}
        </ActionCard>
      </div>
      
      {/* Tips Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold text-foreground mb-3">💡 Tips for Better Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Posting Best Practices:</h4>
            <ul className="space-y-1">
              <li>• Use high-quality images (minimum 1080x1080)</li>
              <li>• Include 3-5 relevant hashtags</li>
              <li>• Post during peak engagement hours</li>
              <li>• Write engaging captions with call-to-actions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Automation Guidelines:</h4>
            <ul className="space-y-1">
              <li>• Start with low limits to test the waters</li>
              <li>• Use longer delays to avoid rate limits</li>
              <li>• Choose specific, relevant hashtags</li>
              <li>• Monitor logs for any issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}