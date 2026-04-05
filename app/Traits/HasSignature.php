<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

trait HasSignature
{
    /**
     * Check if user has signature
     */
    public function hasSignature(): bool
    {
        return !empty($this->signature_path) 
            && Storage::disk('public')->exists($this->signature_path);
    }

    /**
     * Get signature URL
     */
    public function getSignatureUrl(): ?string
    {
        if (!$this->hasSignature()) {
            return null;
        }

        return Storage::disk('public')->url($this->signature_path);
    }

    /**
     * Save signature from base64 data
     */
    public function saveSignature(string $base64Data): string
    {
        // Remove data:image prefix if exists
        $base64Data = preg_replace('/^data:image\/\w+;base64,/', '', $base64Data);
        
        // Decode base64
        $imageData = base64_decode($base64Data);
        
        // Generate filename
        $filename = 'signatures/' . $this->id . '_' . time() . '.png';
        
        // Delete old signature if exists
        if ($this->signature_path) {
            Storage::disk('public')->delete($this->signature_path);
        }
        
        // Save new signature
        Storage::disk('public')->put($filename, $imageData);
        
        // Update user
        $this->update(['signature_path' => $filename]);
        
        return $filename;
    }

    /**
     * Delete signature
     */
    public function deleteSignature(): bool
    {
        if ($this->signature_path) {
            Storage::disk('public')->delete($this->signature_path);
            return $this->update(['signature_path' => null]);
        }

        return false;
    }

    /**
     * Get signature as base64
     */
    public function getSignatureBase64(): ?string
    {
        if (!$this->hasSignature()) {
            return null;
        }

        $path = Storage::disk('public')->path($this->signature_path);
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }
}
