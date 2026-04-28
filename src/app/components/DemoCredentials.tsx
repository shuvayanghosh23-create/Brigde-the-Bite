import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Store, Users, Shield } from 'lucide-react';

export default function DemoCredentials() {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-2xl border-2 border-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">🎯 Demo Login Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Store className="text-green-600" size={16} />
              <span className="font-semibold text-green-900">Restaurant</span>
            </div>
            <p className="font-mono text-xs">Food1 / Food123</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="text-orange-600" size={16} />
              <span className="font-semibold text-orange-900">NGO</span>
            </div>
            <p className="font-mono text-xs">NGO1 / NGO123</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="text-blue-600" size={16} />
              <span className="font-semibold text-blue-900">Admin</span>
            </div>
            <p className="font-mono text-xs">admin / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
