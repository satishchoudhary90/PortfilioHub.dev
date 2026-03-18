"use client";

import { formatDate, getInitials } from "@/lib/utils";

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

export default function ModernSplitResume({
  data,
  editable,
  onEdit,
}: ResumeProps) {
  if (!data) return null;

  const TEAL = "#0d9488";

  return (
    <div className="w-full max-w-[794px] min-h-screen print:min-h-[1123px] mx-auto shadow-sm lg:shadow-2xl flex flex-col lg:flex-row overflow-hidden rounded-lg">
      {/* Left column — 35% teal */}
      <div
        className="w-[35%] min-h-full p-6 flex flex-col text-white"
        style={{ backgroundColor: TEAL }}
      >
        <div className="mb-4">
          {data.image ? (
            <img
              src={data.image}
              alt=""
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white/40"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {getInitials(data.name || "U")}
            </div>
          )}
        </div>
        <h1 className="text-lg font-bold leading-tight">
          <EditableText
            value={data.name}
            field="name"
            editable={editable}
            onEdit={onEdit}
            tag="span"
          />
        </h1>
        <p className="text-sm text-white/90 mt-1">
          <EditableText
            value={data.headline}
            field="headline"
            editable={editable}
            onEdit={onEdit}
            tag="span"
          />
        </p>
        <div className="mt-6 space-y-1.5 text-sm">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.location && <div>{data.location}</div>}
          {data.website && <div>{data.website}</div>}
        </div>

        {data.skills?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-3">
              Skills
            </h2>
            <div className="space-y-2">
              {data.skills.map((skill: any) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span>{skill.name}</span>
                    <span>{skill.level || 85}%</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${skill.level || 85}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages && data.languages.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
              Languages
            </h2>
            <div className="space-y-1 text-sm">
              {data.languages.map((lang: any) => (
                <div key={lang.id}>
                  {typeof lang === "string" ? lang : lang.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.socialLinks?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
              Links
            </h2>
            <div className="space-y-1 text-sm">
              {data.socialLinks.map((link: any) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/90 hover:text-white underline"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column — 65% white */}
      <div className="flex-1 bg-white p-8 text-gray-900">
        {(data.bio || editable) && (
          <section className="mb-8">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-3"
              style={{ color: TEAL }}
            >
              Summary
            </h2>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                <EditableText
                  value={data.bio}
                  field="bio"
                  editable={editable}
                  onEdit={onEdit}
                  tag="span"
                />
              </p>
            </div>
          </section>
        )}

        {data.experiences?.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: TEAL }}
            >
              Experience
            </h2>
            <div className="space-y-5">
              {data.experiences.map((exp: any) => (
                <div
                  key={exp.id}
                  className="rounded-lg border border-gray-200 p-4"
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
              ))}
            </div>
          </section>
        )}

        {data.projects?.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: TEAL }}
            >
              Projects
            </h2>
            <div className="space-y-5">
              {data.projects.map((proj: any) => (
                <div
                  key={proj.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-900">
                      {proj.title}
                    </h3>
                    <div className="flex gap-2 text-xs" style={{ color: TEAL }}>
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
                    <p className="text-xs text-gray-500 mt-1">
                      {proj.techStack.join(" · ")}
                    </p>
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
              style={{ color: TEAL }}
            >
              Education
            </h2>
            <div className="space-y-5">
              {data.educations.map((edu: any) => (
                <div
                  key={edu.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
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
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
