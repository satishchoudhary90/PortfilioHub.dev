"use client";

import { formatDate } from "@/lib/utils";

interface ResumeProps {
  data: any;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
}

function EditableText({
  value,
  field,
  editable,
  onEdit,
  className,
  tag: Tag = "span",
}: {
  value: string;
  field: string;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
  className?: string;
  tag?: any;
}) {
  if (!value && !editable) return null;
  return (
    <Tag
      className={`${className || ""} ${editable ? "outline-none ring-1 ring-transparent hover:ring-indigo-400/50 focus:ring-indigo-500 rounded px-0.5 cursor-text" : ""}`}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={(e: any) =>
        editable && onEdit?.(field, e.currentTarget.textContent || "")
      }
    >
      {value || (editable ? "Click to edit" : "")}
    </Tag>
  );
}

function SkillCircle({
  name,
  level = 85,
  color = "#059669",
}: {
  name: string;
  level?: number;
  color?: string;
}) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (level / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
          {level}%
        </span>
      </div>
      <span className="text-xs text-gray-600 mt-1 text-center">{name}</span>
    </div>
  );
}

export default function InfographicResume({
  data,
  editable,
  onEdit,
}: ResumeProps) {
  if (!data) return null;

  const projectCount = data.projects?.length ?? 0;
  const yearsExp = data.experiences?.length
    ? Math.max(
        0,
        ...data.experiences.map((e: any) => {
          const end = e.current
            ? new Date()
            : e.endDate
              ? new Date(e.endDate)
              : new Date();
          const start = new Date(e.startDate);
          return Math.floor(
            (end.getTime() - start.getTime()) / (365 * 24 * 60 * 60 * 1000),
          );
        }),
      )
    : 0;
  const skillsCount = data.skills?.length ?? 0;

  const accents = {
    emerald: "#059669",
    amber: "#d97706",
    blue: "#2563eb",
    violet: "#7c3aed",
  };

  return (
    <div className="w-full max-w-[794px] min-h-screen print:min-h-[1123px] mx-auto shadow-sm lg:shadow-2xl bg-white p-4 sm:p-6 lg:p-8">
      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div
          className="text-center p-4 rounded-xl"
          style={{ backgroundColor: `${accents.emerald}15` }}
        >
          <div
            className="text-3xl font-bold"
            style={{ color: accents.emerald }}
          >
            {projectCount}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">Projects</div>
        </div>
        <div
          className="text-center p-4 rounded-xl"
          style={{ backgroundColor: `${accents.amber}15` }}
        >
          <div className="text-3xl font-bold" style={{ color: accents.amber }}>
            {yearsExp}+
          </div>
          <div className="text-xs text-gray-600 mt-0.5">Years Exp</div>
        </div>
        <div
          className="text-center p-4 rounded-xl"
          style={{ backgroundColor: `${accents.blue}15` }}
        >
          <div className="text-3xl font-bold" style={{ color: accents.blue }}>
            {skillsCount}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">Skills</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {data.image && (
          <img
            src={data.image}
            alt=""
            className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm shrink-0"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            <EditableText
              value={data.name}
              field="name"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </h1>
          <p className="text-gray-600">
            <EditableText
              value={data.headline}
              field="headline"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </p>
        </div>
      </div>

      {(data.bio || editable) && (
        <section className="mb-8">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: accents.emerald }}
          >
            About
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            <EditableText
              value={data.bio}
              field="bio"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </p>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: accents.blue }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-6 justify-start">
            {data.skills.slice(0, 6).map((skill: any, i: number) => (
              <SkillCircle
                key={skill.id}
                name={skill.name}
                level={skill.level || 85}
                color={[accents.emerald, accents.amber, accents.blue][i % 3]}
              />
            ))}
          </div>
        </section>
      )}

      {data.experiences?.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: accents.emerald }}
          >
            Experience
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-2 top-2 bottom-2 w-0.5 rounded-full"
              style={{ backgroundColor: "#059669" }}
            />
            <div className="space-y-6 pl-8">
              {data.experiences.map((exp: any) => (
                <div key={exp.id} className="relative">
                  <div
                    className="absolute -left-6 w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: "#059669", left: "-1.5rem" }}
                  />
                  <div
                    className="bg-gray-50 rounded-lg p-4 border-l-4"
                    style={{ borderLeftColor: "#059669" }}
                  >
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(exp.startDate)} —{" "}
                        {exp.current
                          ? "Present"
                          : exp.endDate
                            ? formatDate(exp.endDate)
                            : ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.projects?.length > 0 && (
        <section>
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: accents.violet }}
          >
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj: any) => (
              <div
                key={proj.id}
                className="bg-violet-50/50 rounded-lg p-4 border-l-4 border-violet-500"
              >
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                  <div
                    className="flex gap-2 text-xs"
                    style={{ color: accents.violet }}
                  >
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} className="hover:underline">
                        GitHub
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} className="hover:underline">
                        Live
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {proj.description}
                  </p>
                )}
                {proj.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.techStack.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.educations?.length > 0 && (
        <section>
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: accents.amber }}
          >
            Education
          </h2>
          <div className="relative pl-8">
            <div
              className="absolute left-2 top-2 bottom-2 w-0.5 rounded-full"
              style={{ backgroundColor: "#d97706" }}
            />
            <div className="space-y-4">
              {data.educations.map((edu: any) => (
                <div key={edu.id} className="relative">
                  <div
                    className="absolute -left-6 w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: "#d97706", left: "-1.5rem" }}
                  />
                  <div className="bg-amber-50/50 rounded-lg p-4 border-l-4 border-amber-500">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree}
                        {edu.field ? `, ${edu.field}` : ""}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(edu.startDate)} —{" "}
                        {edu.current
                          ? "Present"
                          : edu.endDate
                            ? formatDate(edu.endDate)
                            : ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
