import React, { useState } from 'react';
import './UsernameModal.css';
import { scoreAPI } from '../../appwrite/api';

export default function UsernameModal({ isOpen, onClose, onSubmit }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation first
    if (!username.trim()) {
      setError('Nama pengguna wajib diisi');
      return;
    }

    if (username.trim().length < 2) {
      setError('Nama pengguna minimal 2 karakter');
      return;
    }

    if (username.trim().length > 20) {
      setError('Nama pengguna maksimal 20 karakter');
      return;
    }

    // API validation for username existence
    setError('');
    setIsValidating(true);

    try {
      const result = await scoreAPI.checkUsernameExists(username.trim());

      if (!result.success) {
        // API error - network or server issue
        setError('Tidak dapat memvalidasi nama pengguna. Silakan coba lagi.');
        setIsValidating(false);
        return;
      }

      if (result.exists) {
        // Username already exists
        setError('Nama pengguna sudah digunakan. Silakan pilih nama lain.');
        setIsValidating(false);
        return;
      }

      // Username is available - proceed with game
      setIsValidating(false);
      onSubmit(username.trim());

    } catch (error) {
      console.error('Username validation error:', error);
      setError('Terjadi kesalahan saat memvalidasi nama pengguna. Silakan coba lagi.');
      setIsValidating(false);
    }
  };

  const handleChange = (e) => {
    setUsername(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => { onClose(); setError(''); setUsername('') }} type="button">
          ×
        </button>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={handleChange}
              placeholder="Masukkan nama pengguna"
              className={`username-input ${error ? 'error' : ''}`}
              maxLength="20"
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
            {isValidating && (
              <div className="validating-message">
                <span className="loading-spinner"></span>
                Memvalidasi nama pengguna...
              </div>
            )}
          </div>
          <div className="modal-buttons">
            <button
              type="submit"
              className="play-button"
              disabled={isValidating}
            >
              {isValidating ? 'Memvalidasi...' : 'Mulai Permainan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}