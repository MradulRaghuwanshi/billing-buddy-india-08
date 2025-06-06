
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers } from "@/data/mockData";
import { Plus, Edit, Trash } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Users = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t('userManagement')}</h1>
            <p className="text-gray-500">{t('manageUsers')}</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> {t('addUser')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('systemUsers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('user')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead>{t('dateAdded')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                      }`}>
                        {user.role === 'admin' ? t('admin') : user.role}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;
