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

export default function ElegantResume({
  data,
  editable,
  onEdit,
}: ResumeProps) {
  if (!data) return null;

  return (
    <div
      className="w-[794px] min-h-[1123px] mx-auto shadow-2xl bg-[#f5f5f5] text-gray-800 p-16 font-sans"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      <div className="space-y-12">
        {/* Header — large light-weight name */}
        <div>
          <div className="flex items-center gap-5">
            {data.image && (
              <img src={data.image} alt="" className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow-sm shrink-0" />
            )}
            <div>
          <h1 className="text-4xl font-light tracking-tight">
            <EditableText
              value={data.name}
              field="name"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </h1>
          <p className="text-lg font-light text-gray-600 mt-2">
            <EditableText
              value={data.headline}
              field="headline"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </p>
          <div
            className="h-px my-6"
            style={{ backgroundColor: "#d4d4d4", width: "100%" }}
          />
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
            {data.website && <span>{data.website}</span>}
          </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {(data.bio || editable) && (
          <section>
            <h2
              className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 mb-4"
              style={{ letterSpacing: "0.25em" }}
            >
              Summary
            </h2>
            <div
              className="h-px mb-4"
              style={{ backgroundColor: "#d4d4d4", width: "100%" }}
            />
            <p className="text-sm text-gray-600 leading-relaxed">
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
          <section>
            <h2
              className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 mb-4"
              style={{ letterSpacing: "0.25em" }}
            >
              Experience
            </h2>
            <div
              className="h-px mb-6"
              style={{ backgroundColor: "#d4d4d4", width: "100%" }}
            />
            <div className="space-y-8">
              {data.experiences.map((exp: any) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-normal text-gray-800">{exp.position}</h3>
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
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
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
            <h2
              className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 mb-4"
              style={{ letterSpacing: "0.25em" }}
            >
              Education
            </h2>
            <div
              className="h-px mb-6"
              style={{ backgroundColor: "#d4d4d4", width: "100%" }}
            />
            <div className="space-y-6">
              {data.educations.map((edu: any) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-normal text-gray-800">
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
                  <p className="text-sm text-gray-600 italic">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <h2
              className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 mb-4"
              style={{ letterSpacing: "0.25em" }}
            >
              Projects
            </h2>
            <div
              className="h-px mb-4"
              style={{ backgroundColor: "#d4d4d4", width: "100%" }}
            />
            <div className="space-y-5">
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-normal text-gray-800">{proj.title}</h3>
                    <div className="flex gap-2 text-xs text-gray-500">
                      {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                    </div>
                  </div>
                  {proj.description && <p className="text-sm text-gray-600 italic">{proj.description}</p>}
                  {proj.techStack?.length > 0 && (
                    <p className="text-xs text-gray-500">{proj.techStack.join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills — flowing comma-separated italic */}
        {data.skills?.length > 0 && (
          <section>
            <h2
              className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 mb-4"
              style={{ letterSpacing: "0.25em" }}
            >
              Skills
            </h2>
            <div
              className="h-px mb-4"
              style={{ backgroundColor: "#d4d4d4", width: "100%" }}
            />
            <p className="text-sm text-gray-600 italic leading-relaxed">
              {data.skills.map((skill: any, i: number) => (
                <span key={skill.id}>
                  {skill.name}
                  {i < data.skills.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
