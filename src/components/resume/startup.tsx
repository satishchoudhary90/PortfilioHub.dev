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

export default function StartupResume({
  data,
  editable,
  onEdit,
}: ResumeProps) {
  if (!data) return null;

  return (
    <div className="w-[794px] min-h-[1123px] mx-auto shadow-2xl bg-white text-gray-900 overflow-hidden rounded-lg">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-10 py-8">
        <h1 className="text-2xl font-bold">
          <EditableText
            value={data.name}
            field="name"
            editable={editable}
            onEdit={onEdit}
            tag="span"
          />
        </h1>
        <p className="text-white/90 mt-1">
          <EditableText
            value={data.headline}
            field="headline"
            editable={editable}
            onEdit={onEdit}
            tag="span"
          />
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {data.email && (
            <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
              {data.email}
            </span>
          )}
          {data.phone && (
            <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
              {data.phone}
            </span>
          )}
          {data.location && (
            <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
              {data.location}
            </span>
          )}
          {data.website && (
            <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
              {data.website}
            </span>
          )}
        </div>
      </div>

      <div className="p-10 space-y-6">
        {/* Bio */}
        {(data.bio || editable) && (
          <section>
            <h2 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <span>💼</span> About
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

        {/* Experience — card-like blocks */}
        {data.experiences?.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <span>💼</span> Experience
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp: any) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-gray-50 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-sm text-violet-600">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(exp.startDate)} —{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate
                          ? formatDate(exp.endDate)
                          : ""}
                    </span>
                  </div>
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

        {/* Education */}
        {data.educations?.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <span>🎓</span> Education
            </h2>
            <div className="space-y-4">
              {data.educations.map((edu: any) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-xl bg-gray-50 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </h3>
                      <p className="text-sm text-violet-600">
                        {edu.institution}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(edu.startDate)} —{" "}
                      {edu.current
                        ? "Present"
                        : edu.endDate
                          ? formatDate(edu.endDate)
                          : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <span>🚀</span> Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="p-4 rounded-xl bg-gray-50 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                    <div className="flex gap-2 text-xs text-violet-600">
                      {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                    </div>
                  </div>
                  {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
                  {proj.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 text-xs">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills — pill badges */}
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <span>⚡</span> Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="px-3 py-1.5 rounded-full bg-violet-100 text-violet-800 text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
