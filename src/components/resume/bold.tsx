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

export default function BoldResume({ data, editable, onEdit }: ResumeProps) {
  if (!data) return null;

  return (
    <div className="w-[794px] min-h-[1123px] mx-auto shadow-2xl flex overflow-hidden">
      {/* Left column — 30% black */}
      <div
        className="w-[30%] min-h-full p-8 text-white flex flex-col"
        style={{ backgroundColor: "#111" }}
      >
        <div className="flex items-center gap-4">
          {data.image && (
            <img src={data.image} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-white/30 shrink-0" />
          )}
          <div>
        <h1 className="text-xl font-bold leading-tight">
          <EditableText
            value={data.name}
            field="name"
            editable={editable}
            onEdit={onEdit}
            tag="span"
          />
        </h1>
        <p className="text-sm text-white/80 mt-2">
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
        <div className="mt-6 space-y-2 text-sm">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.location && <div>{data.location}</div>}
          {data.website && <div>{data.website}</div>}
        </div>
        {data.skills?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="px-2 py-1 text-xs bg-white/10 text-white rounded"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column — 70% white */}
      <div className="flex-1 bg-white text-gray-900 p-8">
        {/* Bio */}
        {(data.bio || editable) && (
          <section className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-3">
              Summary
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

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-4">
              Experience
            </h2>
            <div className="space-y-5">
              {data.experiences.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="font-semibold"
                      style={{ color: "#dc2626" }}
                    >
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

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-4">
              Projects
            </h2>
            <div className="space-y-5">
              {data.projects.map((proj: any) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold" style={{ color: "#dc2626" }}>{proj.title}</h3>
                    <div className="flex gap-2 text-xs" style={{ color: "#dc2626" }}>
                      {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                    </div>
                  </div>
                  {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
                  {proj.techStack?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{proj.techStack.join(" · ")}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.educations?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-4">
              Education
            </h2>
            <div className="space-y-5">
              {data.educations.map((edu: any) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="font-semibold"
                      style={{ color: "#dc2626" }}
                    >
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
