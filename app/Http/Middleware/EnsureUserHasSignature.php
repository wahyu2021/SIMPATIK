<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasSignature
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Skip for signature routes (create & store)
        if ($request->routeIs('signature.create', 'signature.store', 'signature.edit', 'signature.update')) {
            return $next($request);
        }

        // Check if user needs signature onboarding
        if ($user && $user->needsSignatureOnboarding()) {
            return redirect()->route('signature.create')
                ->with('warning', 'Anda harus melengkapi tanda tangan digital terlebih dahulu.');
        }

        return $next($request);
    }
}

