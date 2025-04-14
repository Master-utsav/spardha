import { Code, GraduationCap, User } from 'lucide-react';

const CompetitionNav = ({
  name,
  emailOrEnrollment,
  quizId,
  language,
}: {
  name: string;
  emailOrEnrollment: string;
  quizId: string;
  language: string;
}) => {
  return (
    <nav className="fixed left-0 top-0 z-[1000] w-full bg-gray-900 p-4 text-white shadow-md">
      <ul className="mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* User Name */}
        <li className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-400" />
          <span className="font-medium">{name}</span>
        </li>

        {/* Role-Specific Info */}
        <li className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-gray-400" />
          <span className="font-medium">{emailOrEnrollment}</span>
        </li>

        {/* Quiz ID */}
        <li className="flex items-center gap-2">
          <span className="font-semibold capitalize">
            {quizId.replaceAll('-', ' ')}
          </span>
        </li>

        {/* Language */}
        <li className="flex items-center gap-2">
          <Code className="h-5 w-5 text-gray-400" />
          <span className="font-medium">{language.toUpperCase()}</span>
        </li>
      </ul>
    </nav>
  );
};

export default CompetitionNav;
